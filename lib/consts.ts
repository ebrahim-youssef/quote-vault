/**
 * Link constants for localized routing
 * All links should be constructed with locale prefix when used in Server Components
 * Usage in Server Components: useLocale() hook or params.locale
 */

/** Request header set by next-i18n-router middleware (see proxy.ts). */
export const LOCALE_HEADER = 'x-next-i18n-router-locale'

export const links = {
	pages: {
		home: '/', // Will be prefixed with locale in use
		dashboard: '/dashboard' // Will be prefixed with locale in use
	},
	navigationLinks: [{ href: '/dashboard', label: 'Dashboard' }],
	navigation: {
		about: '/#about',
		experience: '/#experience',
		skills: '/#skills',
		contact: '/#contact',
		projects: '/#projects'
	}
}

export const brand = {
	twitter: 'https://twitter.com/yourprofile',
	github: '',
	linkedin: 'https://www.linkedin.com/in/yourprofile/'
}
