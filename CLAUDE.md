# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run lint-fix     # ESLint with auto-fix
npm run format       # Prettier format

npx prisma migrate dev --name <name>   # Create and apply a migration
npx prisma generate                    # Regenerate Prisma client
npx prisma studio                      # Open DB GUI
npx prisma db seed                     # Run prisma/seed.ts
```

No test suite exists in this project.

## Environment Variables

Copy `.env.example` to `.env`. Required vars:

- `DATABASE_URL` — PostgreSQL connection string (Prisma Accelerate connection string format)
- `AUTH_SECRET` — NextAuth secret (note: `lib/auth.ts` explicitly reads `NEXTAUTH_SECRET`; set both if unsure)
- `NEXT_PUBLIC_SITE_URL` — Base URL (defaults to `http://localhost:3000`)
- `GITHUB_ID` / `GITHUB_SECRET` — Optional GitHub OAuth provider

## Architecture

### Routing & i18n

All pages live under `app/[locale]/` — every route is locale-prefixed (e.g., `/en/dashboard`, `/ar/dashboard`). The `proxy.ts` file acts as Next.js middleware (not the conventional `middleware.ts`); it chains `NextAuth`'s `auth()` wrapper with `next-i18n-router` to handle locale prefixing automatically.

Supported locales: `en`, `ar` (RTL). Config lives in `config/i18nConfig.ts`.

Translation strings:

- **Server components**: call `getDictionary(locale)` from `lib/get-dictionary.ts` — dynamically imports `public/messages/<locale>.json`
- **Client components**: use `react-i18next` hooks (initialized in `lib/i18n.ts`)
- Type definitions for the dictionary shape are in `types/dictionary.d.ts`

### Authentication

NextAuth.js v5 (`next-auth@beta`) configured in `lib/auth.ts`. Two providers:

1. **Credentials** — email/password with bcrypt hashing via `lib/password.ts`. Auto-creates a user account on first sign-in if the email doesn't exist yet.
2. **GitHub OAuth**

Session strategy is JWT. The `session.user.id` is injected via `jwt`/`session` callbacks. Auth routes are at `app/(auth)/`. The NextAuth catch-all handler lives at `app/api/auth/[...nextauth]/`.

**Gotcha**: `lib/auth.ts` instantiates its own `new PrismaClient()` directly — it does **not** use the singleton from `lib/db.ts`. Any auth-adjacent DB logic must go through `lib/auth.ts`'s own client or be added carefully to avoid connection pool conflicts.

### Database

Prisma client is generated to `./generated/prisma` (non-default path) — import from `@/generated/prisma`, not `@prisma/client`. The postinstall script runs `prisma generate --no-engine` because Prisma Accelerate provides the query engine via CDN rather than bundling it. The singleton in `lib/db.ts` wraps the client with `withAccelerate()`. Always use `prisma` from `lib/db.ts` in server actions and page components.

Core models: `User`, `Quote`. A `Quote` belongs to a `User` and stores `quoteText`, `author`, `source`, `reflection`, `tags` (string array), and `isPublic`.

### App Structure

```
app/
  api/auth/[...nextauth]/  # NextAuth route handler
  (auth)/                  # Sign-in/out actions and components (no locale prefix)
  [locale]/
    (marketing)/           # Landing page
    (dashboard)/
      dashboard/
        actions/           # Server Actions: create-quote, edit-quote, delete-quote
        components/        # Modal components for CRUD
        page.tsx           # Auth-gated; redirects to /{locale} if no session
    layout.tsx             # Root locale layout — sets lang/dir, wraps with ThemeProvider + I18nClient
```

Route groups `(auth)`, `(marketing)`, and `(dashboard)` are organizational only and don't affect the URL path.

### Path Alias

`@/*` resolves to the project root. Use `@/lib/...`, `@/components/...`, etc.

### UI

shadcn/ui components in `components/ui/`. Shared layout components (`Header`, `Footer`, `QuoteCard`, etc.) in `components/shared/`. Tailwind CSS v4 with `@tailwindcss/postcss`. Toast notifications use `sonner` — the `<Toaster>` is mounted in `app/[locale]/layout.tsx`.

### Server Actions Pattern

All mutations use Next.js Server Actions (files marked `'use server'`). They:

1. Re-derive the locale from the `x-next-i18n-router-locale` request header (via the `LOCALE_HEADER` constant in `lib/consts.ts`)
2. Look up error strings from the dictionary so messages are i18n-aware
3. Verify the session with `auth()`
4. Return `{ success: boolean, error?: string, data?: T }` — callers should check `success` before using `data`
5. Call `revalidatePath` with the locale-prefixed path after mutations

### Forms

Forms use controlled React state with manual validation in the modal components; server actions re-validate input. (`react-hook-form`/`zod` are not used.)

### Quote Card Export

`components/shared/html-to-image.tsx` uses the `html-to-image` + `downloadjs` packages to let users export a quote card as an image.
