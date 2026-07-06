'use client'

import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { i18nConfig } from '@/config/i18nConfig'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
	const { t } = useTranslation()
	const pathname = usePathname()
	const segments = pathname?.split('/') ?? []
	const currentLocale = i18nConfig.locales.includes(segments[1])
		? segments[1]
		: i18nConfig.defaultLocale
	const otherLocale =
		i18nConfig.locales.find((l) => l !== currentLocale) ?? i18nConfig.defaultLocale

	const switchPath = (() => {
		if (!pathname) return '/'
		const segs = pathname.split('/')
		segs[1] = otherLocale
		return segs.join('/')
	})()

	return (
		<Button variant="ghost" size="icon" asChild>
			<Link href={switchPath} aria-label={t('common.toggleLanguage')}>
				<span
					className="text-xs font-bold tracking-wide"
					style={{ fontFamily: 'var(--font-body)' }}
					aria-hidden="true"
				>
					{otherLocale.toUpperCase()}
				</span>
			</Link>
		</Button>
	)
}
