import '@/styles/globals.css'
import type { Metadata } from 'next'
import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'
import { ThemeProvider } from '@/components/theme-provider'
import ScrollToTop from '@/components/shared/scroll-to-top'
import { i18nConfig } from '@/config/i18nConfig'
import I18nClient from '@/components/i18n-client'
import { Toaster } from 'sonner'
import { getDictionary } from '@/lib/get-dictionary'
import { Analytics } from '@vercel/analytics/next'

const getBaseUrl = () => {
	if (process.env.NEXT_PUBLIC_SITE_URL) {
		return process.env.NEXT_PUBLIC_SITE_URL
	}

	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`
	}

	return 'http://localhost:3000'
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params
	const dictionary = await getDictionary(locale)
	const title = dictionary?.branding?.name ?? 'Quote Manager'
	const description = dictionary?.landing?.ctaDescription ?? 'Save, organize, and share your favorite quotes.'
	const metadataBase = new URL(getBaseUrl())

	return {
		metadataBase,
		title,
		description,
		keywords: ['quotes', 'quotes app', 'quote manager', 'quote collection'],
		authors: [{ name: 'Quote Vault' }],
		openGraph: {
			title,
			description,
			siteName: title,
			type: 'website',
			locale,
			images: [
				{
					url: '/opengraph-image.jpg',
					alt: title
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: ['/opengraph-image.jpg']
		}
	} as Metadata
}

export async function generateStaticParams() {
	return i18nConfig.locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Readonly<LocaleLayoutProps>) {
	const { locale } = await params
	const dir = locale === 'ar' ? 'rtl' : 'ltr'
	return (
		<html lang={locale} dir={dir} suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<I18nClient locale={locale}>
						<Header locale={locale} />
						<main>{children}</main>
						<Footer locale={locale} />
						<ScrollToTop />
						<Toaster richColors position={dir === 'rtl' ? 'top-left' : 'top-right'} />
					</I18nClient>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	)
}
