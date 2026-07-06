# Quote Vault — Product Vision & Current State

> A working document to capture what Quote Vault was meant to be, what it actually is
> today, and a few angles worth researching before deciding whether it's a personal
> tool or a real product.

---

## 1. In one line

A capture-and-reflect quote vault: save a quote **plus your own thoughts on it**, share
it as an image, and resurface it over time so you don't forget what you once thought.

---

## 2. The original vision

### The "why"

You hear a quote — or something that strikes you — and you want to capture it *together
with your own reflection*: what it made you think, why it mattered to you at that moment.
The point isn't to hoard famous quotes; it's to keep **your own thoughts** from slipping
away over time.

From that single capture, two things were supposed to flow:

### Pillar 1 — Share as an image

Export a quote as a clean, shareable photo for social media, with a choice of:

- **Quote only**, or
- **Quote + your reflection** (your take on it).

### Pillar 2 — Resurface / self-reminder

Embed your collection as an **iframe** inside Notion, Obsidian, or a similar vault, where
it surfaces a **random quote (with your reflection)** from your own library. The idea: be
periodically reminded of your past quotes and thoughts, so you don't lose yourself or
forget what mattered to you.

---

## 3. Current state — what's actually built

| Area | Status | Notes |
|------|--------|-------|
| **Auth** | ✅ Done | NextAuth v5 — email/password (bcrypt, auto-creates account on first sign-in) + GitHub OAuth. (`lib/auth.ts`) |
| **i18n** | ✅ Done | Full English + Arabic (RTL) across all routes. (`config/i18nConfig.ts`) |
| **Quote CRUD** | ✅ Done | Add / edit / delete via server actions + modals. (`app/[locale]/(dashboard)/dashboard/`) |
| **Image export** | ✅ Done | Working PNG export of a styled, theme-aware quote card. (`components/shared/html-to-image.tsx`) |
| **Public discovery** | ✅ Done | `isPublic` toggle; landing page shows recent public quotes. (`app/[locale]/(marketing)/page.tsx`) |

What a quote currently captures: **quote text, author, source, tags, public/private**.

---

## 4. The gap between vision and reality

- **Reflection is orphaned.** The `reflection` field exists in the database schema
  (`prisma/schema.prisma`) but is wired into **no form** — it can't be entered, edited, or
  exported. This is the *heart* of the product ("my thoughts around the quote"), and it is
  effectively missing from the live app.
- **No quote-only vs. quote+reflection export toggle.** The export always shows the same
  card — and since reflections aren't captured, there's nothing to toggle anyway.
- **Pillar 2 is 0% built.** There is no random-quote logic, no embed/iframe page, no public
  API route, and no Notion/Obsidian widget — not even a stub.
- **No organization at scale.** No search, no tag filtering, no sorting beyond newest-first.
- **No per-quote share page or share links.** Public quotes only appear in an aggregate
  grid on the landing page; there's no shareable URL for a single quote.

---

## 5. Honest status

- **Pillar 1 (capture + image share): ~70%** — solid, but missing the "reflection" core
  that makes it *yours* rather than a generic quote collector.
- **Pillar 2 (resurface / embed widget): 0%** — not started.

> Today the app is a **personal quote vault with public discovery** — not yet the
> **reflection-capture + self-reminder system** it was meant to be.

---

## 6. Market-research angles to investigate

A few questions worth answering before committing more time:

1. **Who actually wants to capture their *own reflections* on quotes** (vs. just collecting
   quotes)? Likely the journaling / PKM / "second brain" crowd — Notion, Obsidian, and
   Readwise users.
2. **Is the real differentiator the resurfacing-in-your-vault angle?** Compare against
   Readwise (highlight resurfacing), Obsidian plugins, and spaced-repetition tools. If
   Pillar 2 is the unique pull, it should probably be built before Pillar 1 is polished.
3. **Is image-export-for-social a genuine pull, or just table stakes?** There are many
   "quote image" generators already — check whether that alone attracts anyone.
4. **Personal tool vs. product signal.** Would *you* pay for it? Would others? What's the
   smallest version worth shipping to test demand — likely: **wire up `reflection`** end to
   end, then ship a **read-only random-quote embed** for Notion/Obsidian.

---

*Last updated: 2026-06-18*
