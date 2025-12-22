'use client'
import { toPng } from 'html-to-image'
import download from 'downloadjs'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
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

	const isArabic = isTextArabic(latestQuote.quoteText)
	const convertHtmlToImage = async (node: HTMLElement, imageName: string) => {
		if (!node) {
			toast.error(t('errors.couldNotFindElement'))
			return
		}

		try {
			setIsLoading(true)
			const imageDataUrl = await toPng(node, {
				cacheBust: true,
				pixelRatio: 2
			})
			download(imageDataUrl, `${imageName.slice(0, 50)}.png`)
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
		const node = (event.currentTarget as HTMLFormElement).children[0]
		if (node instanceof HTMLElement) {
			convertHtmlToImage(node, latestQuote.quoteText)
		}
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col items-center gap-6 py-8 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-4xl">
				<div className="relative rounded-lg sm:rounded-2xl p-8 sm:p-12">
					<div
						className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] text-primary opacity-10"
						aria-hidden="true"
					>
						“
					</div>

					<div className="relative z-10 px-6 sm:px-8">
						<p
							dir={isArabic ? 'rtl' : 'ltr'}
							className={`text-justify text-2xl md:text-3xl text-foreground leading-relaxed mb-6 sm:mb-8 ${isArabic ? 'font-serif-ar' : 'serif!'}`}
						>
							{latestQuote.quoteText}
						</p>

						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
							<div className="flex-1">
								<p className=" text-muted-foreground font-medium">&mdash; {latestQuote.author}</p>
								{latestQuote.source && (
									<p className="text-xs sm:text-sm text-primary-foreground/70 mt-2">
										{latestQuote.source}
									</p>
								)}
							</div>

							<div className="text-left sm:text-right">
								<p className="text-xs sm:text-sm text-primary-foreground/70">
									shared by{' '}
									<span className="text-primary-foreground/90 font-medium">
										@{latestQuote.user.name || 'Anonymous'}
									</span>
								</p>
							</div>
						</div>

						{/* Tags */}
						{latestQuote.tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-6 sm:mt-8">
								{latestQuote.tags.map((tag: string) => (
									<span
										key={tag}
										className="px-2 sm:px-3 py-1 bg-primary-foreground/10 text-primary-foreground text-xs rounded-full"
									>
										#{tag}
									</span>
								))}
							</div>
						)}
					</div>

					<div
						className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 text-4xl sm:text-6xl text-primary-foreground/20"
						aria-hidden="true"
					>
						&rdquo;
					</div>
				</div>
			</div>

			<Button
				size="lg"
				variant="ghost"
				disabled={isLoading}
				aria-label={isLoading ? t('errors.downloading') : t('errors.downloadQuote')}
				aria-busy={isLoading}
			>
				<Download className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
				{isLoading ? t('errors.downloading') : t('errors.downloadQuote')}
			</Button>
		</form>
	)
}
