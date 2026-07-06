'use client'
import { toPng } from 'html-to-image'
import download from 'downloadjs'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useRef } from 'react'
import { isTextArabic } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

type HtmlToImageProps = {
	latestQuote: {
		user: {
			name: string | null
		}
		id: string
		quoteText: string
		author: string
		source: string | null
		tags: string[]
		isPublic: boolean
	}
}

export default function HtmlToImage({ latestQuote }: HtmlToImageProps) {
	const [isLoading, setIsLoading] = useState(false)
	const { t } = useTranslation()
	const cardRef = useRef<HTMLDivElement>(null)

	const isArabic = isTextArabic(latestQuote.quoteText)

	const convertHtmlToImage = async (node: HTMLElement | null, imageName: string) => {
		if (!node) {
			toast.error(t('errors.couldNotFindElement'))
			return
		}

		try {
			setIsLoading(true)
			const safeFilename = imageName.replace(/[^\w\s-]/g, '').trim().slice(0, 50) || 'quote'
			const imageDataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 })
			download(imageDataUrl, `${safeFilename}.png`)
			toast.success(t('errors.downloadSuccess'))
		} catch (error) {
			console.error('Error converting to image:', error)
			toast.error(t('errors.downloadFailed'))
		} finally {
			setIsLoading(false)
		}
	}

	function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		convertHtmlToImage(cardRef.current, latestQuote.quoteText)
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col items-center gap-5">
			<div className="w-full">
				<div
					ref={cardRef}
					className="ia-pattern-bg relative overflow-hidden p-8 sm:p-10 bg-card"
					style={{
						borderRadius: 'var(--radius-xl)',
						border: '1px solid var(--border)',
						boxShadow: 'var(--shadow-md)'
					}}
				>
					{/* Decorative open-quote */}
					<div
						className="pointer-events-none select-none absolute start-6 top-4 text-[120px] leading-none"
						style={{ color: 'var(--primary)', opacity: 0.07, fontFamily: 'var(--font-display)' }}
						aria-hidden="true"
					>
						&ldquo;
					</div>

					<div className="relative z-10">
						<p
							dir={isArabic ? 'rtl' : 'ltr'}
							className="text-start text-2xl md:text-3xl leading-relaxed mb-6 font-bold text-card-foreground"
							style={{ fontFamily: isArabic ? 'var(--font-ar)' : 'var(--font-display)' }}
						>
							{latestQuote.quoteText}
						</p>

						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
							<div>
								<p className="font-medium text-sm" style={{ color: 'var(--primary)' }}>
									&mdash; {latestQuote.author}
								</p>
								{latestQuote.source && (
									<p className="text-xs mt-1 text-muted-foreground">{latestQuote.source}</p>
								)}
							</div>
							<p className="text-xs text-muted-foreground">
								{t('htmlToImage.sharedBy')}{' '}
								<span className="font-medium" style={{ color: 'var(--primary)' }}>
									@{latestQuote.user.name || t('common.anonymous')}
								</span>
							</p>
						</div>

						{latestQuote.tags.length > 0 && (
							<div className="flex flex-wrap gap-1.5 mt-5">
								{latestQuote.tags.map((tag: string) => (
									<span
										key={tag}
										className="text-xs px-2.5 py-1 rounded"
										style={{
											background: 'var(--tag-bg)',
											color: 'var(--tag-text)',
											border: '1px solid var(--border)'
										}}
									>
										#{tag}
									</span>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			<Button
				size="lg"
				variant="default"
				disabled={isLoading}
				aria-label={isLoading ? t('errors.downloading') : t('errors.downloadQuote')}
				aria-busy={isLoading}
			>
				<Download className="h-4 w-4" aria-hidden="true" />
				{isLoading ? t('errors.downloading') : t('errors.downloadQuote')}
			</Button>
		</form>
	)
}
