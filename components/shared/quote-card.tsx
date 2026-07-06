import { headers } from 'next/headers'
import { getDictionary } from '@/lib/get-dictionary'
import { isTextArabic } from '@/lib/utils'
import { LOCALE_HEADER } from '@/lib/consts'

interface QuoteCardProps {
	quote: string
	author: string
	source?: string | null
	tags?: string[]
	userName: string | null
	isPublic?: boolean
	children?: React.ReactNode
}

export async function QuoteCard({ quote, author, source, tags = [], userName, isPublic, children }: QuoteCardProps) {
	const isArabic = isTextArabic(quote)

	const locale = (await headers()).get(LOCALE_HEADER) || 'en'
	const dictionary = await getDictionary(locale)

	const statusPublic = dictionary?.status?.public ?? 'Public'
	const statusPrivate = dictionary?.status?.private ?? 'Private'

	return (
		<div
			className="quote-card relative flex flex-col h-full overflow-hidden bg-card border border-border"
			style={{
				borderRadius: 'var(--radius-lg)',
				boxShadow: 'var(--shadow-sm)',
				transition: 'box-shadow var(--dur-base) var(--ease-soft), transform var(--dur-base) var(--ease-soft)'
			}}
		>
			{/* Star accent */}
			<span className="ia-star-accent" aria-hidden="true" />

			{/* Public/private badge */}
			{isPublic !== undefined && (
				<div className="absolute top-3 start-3">
					<span
						className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
						style={{
							...(isPublic
								? {
										background: 'color-mix(in srgb, var(--gold-500) 18%, transparent)',
										color: 'var(--gold-600)'
									}
								: {
										background: 'var(--tag-bg)',
										color: 'var(--tag-text)'
									})
						}}
					>
						{isPublic ? statusPublic : statusPrivate}
					</span>
				</div>
			)}

			{/* Quote body */}
			<div className="flex-1 px-6 pt-10 pb-4">
				<p
					dir={isArabic ? 'rtl' : 'ltr'}
					className="text-start text-lg leading-[1.6] line-clamp-4 font-semibold text-foreground"
					style={{ fontFamily: isArabic ? 'var(--font-ar)' : 'var(--font-display)' }}
				>
					{quote}
				</p>
			</div>

			{/* Footer */}
			<div className="px-6 pb-6 flex flex-col gap-3">
				{/* Author */}
				<p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
					&mdash; {author}
				</p>
				{source && (
					<p className="text-xs text-muted-foreground">{source}</p>
				)}

				{/* Tags */}
				{tags.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{tags.map((tag) => (
							<span
								key={tag}
								className="text-xs px-2.5 py-1 rounded border border-border"
								style={{
									background: 'var(--tag-bg)',
									color: 'var(--tag-text)'
								}}
							>
								#{tag}
							</span>
						))}
					</div>
				)}

				{/* Username */}
				{userName && (
					<div className="pt-3 border-t border-border">
						<p className="text-sm text-muted-foreground">
							<span className="font-medium" style={{ color: 'var(--primary)' }}>@{userName}</span>
						</p>
					</div>
				)}

				{/* Action buttons */}
				{children && <div className="flex gap-2 pt-2">{children}</div>}
			</div>
		</div>
	)
}
