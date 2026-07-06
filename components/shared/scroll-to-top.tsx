'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Props = {
	threshold?: number
	className?: string
}

export default function ScrollToTop({ threshold = 300, className = '' }: Props) {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setVisible(window.scrollY > threshold)
		}

		handleScroll()

		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [threshold])

	const handleClick = useCallback(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
	}, [])
	const { t } = useTranslation()
	return (
		<div
			aria-hidden={!visible}
			className={`fixed bottom-4 end-4 sm:bottom-6 sm:end-6 z-50 transition-all duration-500 ${
				visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
			} ${className}`}
		>
			<Button
				aria-label={t('common.scrollToTop')}
				title={t('common.scrollToTop')}
				onClick={handleClick}
				size="icon"
				className="h-10 w-10 rounded-full shadow-md hover:shadow-gold transition-all duration-200 hover:scale-110 active:scale-95"
			>
				<ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
				<span className="sr-only">{t('common.scrollToTop')}</span>
			</Button>
		</div>
	)
}
