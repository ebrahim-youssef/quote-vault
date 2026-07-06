import { i18nRouter } from 'next-i18n-router'
import { i18nConfig } from './config/i18nConfig'
import { auth } from './lib/auth'

/**
 * Middleware for next-i18n-router + NextAuth integration
 *
 * According to Auth.js v5 reference (https://authjs.dev/reference/nextjs):
 * The auth() function wraps middleware with automatic session handling.
 *
 * Chain of execution:
 * 1. auth() wraps the middleware for session management
 * 2. next-i18n-router handles locale prefix routing
 * 3. Protected route authorization via auth.callbacks.authorized (optional)
 */
export default auth((req) => {
	// Apply locale routing with next-i18n-router
	// next-i18n-router automatically adds locale prefix if missing
	return i18nRouter(req, i18nConfig)
})

// Configure which routes should be processed by middleware
export const config = {
	matcher: [
		// Include all routes except API and static assets (any path containing a dot,
		// e.g. /fonts/*.ttf, /assets/*.svg, /messages/*.json)
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
	]
}
