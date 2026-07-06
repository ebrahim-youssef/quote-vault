import prisma from '@/lib/db'
import { Sparkles, Bookmark, Tag, ImageDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { QuoteCard } from '@/components/shared/quote-card'
import { getDictionary } from '@/lib/get-dictionary'
import HtmlToImage from '@/components/shared/html-to-image'

const getQuotes = async () => {
	try {
		const quotes = await prisma.quote.findMany({
			where: { isPublic: true },
			select: {
				user: { select: { name: true } },
				id: true,
				quoteText: true,
				author: true,
				source: true,
				tags: true,
				isPublic: true
			},
			take: 6,
			orderBy: { createdAt: 'desc' }
		})
		return quotes || []
	} catch (error) {
		console.error('Error fetching quotes:', error)
		return []
	}
}

interface DiscoveryPageProps {
	params: Promise<{ locale: string }>
}

export default async function DiscoveryPage({ params }: DiscoveryPageProps) {
	const { locale } = await params
	const dictionary = await getDictionary(locale)
	const sampleQuotes = await getQuotes()
	const latestQuote = sampleQuotes[0]

	return (
		<div className="min-h-screen bg-background">
			{/* ── Featured Quote (main hero) ────────────────────────────── */}
			<section className="ia-pattern-bg ia-pattern-bg--teal py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					{/* Eyebrow */}
					<div className="flex justify-center mb-8">
						<span className="eyebrow animate-entry inline-flex items-center gap-2">
							<Sparkles
								className="h-3.5 w-3.5 flex-shrink-0"
								style={{ color: 'var(--gold-500)' }}
								aria-hidden="true"
							/>
							{dictionary.landing?.latestBadge ?? 'Latest Quote'}
						</span>
					</div>

					{/* Quote card — centered, constrained width */}
					{latestQuote && (
						<div className="max-w-2xl mx-auto animate-entry animate-entry-d1">
							<HtmlToImage latestQuote={latestQuote} />
						</div>
					)}
				</div>
			</section>

			{/* ── Discover Wisdom (secondary hero) ─────────────────────── */}
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 border-b border-border">
				<div className="max-w-2xl">
					<h1
						className="font-extrabold animate-entry animate-entry-d1 tracking-tight"
						style={{
							fontSize: 'clamp(38px, 5.5vw, 58px)',
							lineHeight: 1.05,
							color: 'var(--teal-700)',
							marginBottom: '20px',
							fontFamily: 'var(--font-display)'
						}}
					>
						{dictionary.landing?.discoverTitle ?? 'Discover Wisdom'}
					</h1>

					<p
						className="text-lg leading-relaxed animate-entry animate-entry-d2 mb-8"
						style={{ color: 'var(--foreground)', fontFamily: 'var(--font-body)' }}
					>
						{dictionary.landing?.discoverDescription ??
							'Explore a curated collection of quotes from our community'}
					</p>

					<div className="flex flex-wrap gap-3 animate-entry animate-entry-d3">
						<Button asChild size="lg" variant="default">
							<Link href={`/${locale}/dashboard`}>
								{dictionary.landing?.getStarted ?? 'Get Started'}
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="ghost"
							style={{ color: 'var(--teal-700)' }}
						>
							<Link href="#quotes">{dictionary.landing?.exploreQuotes ?? 'Explore Quotes'}</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* ── How It Works ──────────────────────────────────────────── */}
			<section
				className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-border"
			>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
					{[
						{
							icon: Bookmark,
							title: dictionary.landing?.featureSaveTitle ?? 'Save',
							desc:
								dictionary.landing?.featureSaveDesc ??
								'Capture quotes from books, articles, or anywhere that inspires you.'
						},
						{
							icon: Tag,
							title: dictionary.landing?.featureOrganizeTitle ?? 'Organize',
							desc:
								dictionary.landing?.featureOrganizeDesc ??
								'Tag and categorize your collection to find any quote instantly.'
						},
						{
							icon: ImageDown,
							title: dictionary.landing?.featureShareTitle ?? 'Share',
							desc:
								dictionary.landing?.featureShareDesc ??
								'Export beautiful quote cards as images to share with the world.'
						}
					].map(({ icon: Icon, title, desc }) => (
						<div key={title} className="flex items-start gap-4">
							<span
								className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)]"
								style={{ background: 'var(--tag-bg)', color: 'var(--primary)' }}
							>
								<Icon className="h-5 w-5" aria-hidden="true" />
							</span>
							<div>
								<h3
									className="text-base font-bold mb-1"
									style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}
								>
									{title}
								</h3>
								<p
									className="text-sm leading-relaxed text-muted-foreground max-w-[36ch]"
									style={{ fontFamily: 'var(--font-body)' }}
								>
									{desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* ── Recent Quotes ─────────────────────────────────────────── */}
			<section id="quotes" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="mb-10">
					<span className="eyebrow block mb-2">
						{dictionary.landing?.communityEyebrow ?? 'Community'}
					</span>
					<h2
						className="font-bold"
						style={{
							fontSize: 'clamp(26px, 3.6vw, 34px)',
							fontFamily: 'var(--font-display)',
							color: 'var(--teal-700)',
							marginBottom: '8px'
						}}
					>
						{dictionary.landing?.recentTitle ?? 'Recent Quotes'}
					</h2>
					<p className="text-base max-w-2xl text-muted-foreground">
						{dictionary.landing?.recentDescription ?? 'Explore wisdom shared by our community members'}
					</p>
				</div>

				{sampleQuotes.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto mb-10">
						{sampleQuotes.map((quote) => (
							<QuoteCard
								key={quote.id}
								quote={quote.quoteText}
								author={quote.author}
								source={quote.source}
								tags={quote.tags}
								userName={quote.user.name || (dictionary?.common?.anonymous ?? 'Anonymous')}
							/>
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<p className="mb-6 text-muted-foreground">
							{dictionary.landing?.noQuotes ?? 'No quotes available yet. Be the first to share!'}
						</p>
						<Button asChild size="lg">
							<Link href={`/${locale}/dashboard`}>
								{dictionary.landing?.startCreating ?? 'Start Creating'}
							</Link>
						</Button>
					</div>
				)}
			</section>

			{/* ── CTA ──────────────────────────────────────────────────── */}
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
				<div
					className="ia-pattern-bg max-w-2xl mx-auto text-center p-10 md:p-14 relative overflow-hidden"
					style={{
						background: 'var(--teal-900)',
						borderRadius: 'var(--radius-xl)',
						boxShadow: 'var(--shadow-lg)'
					}}
				>
					<h3
						className="font-bold mb-4"
						style={{
							fontSize: 'clamp(22px, 3vw, 30px)',
							color: 'var(--cream)',
							fontFamily: 'var(--font-display)'
						}}
					>
						{dictionary.landing?.ctaTitle ?? 'Build Your Quote Collection'}
					</h3>
					<p
						className="mb-8 text-base leading-relaxed"
						style={{ color: 'rgba(254,248,236,0.8)', fontFamily: 'var(--font-body)' }}
					>
						{dictionary.landing?.ctaDescription ??
							'Save, organize, and share your favorite quotes with our community. Create beautiful, shareable quote images.'}
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Button
							asChild
							size="lg"
							style={{
								background: 'var(--gold-500)',
								color: 'var(--charcoal)',
								border: 'none',
								fontFamily: 'var(--font-body)',
								fontWeight: 600
							}}
						>
							<Link href={`/${locale}/dashboard`}>{dictionary.landing?.getStarted ?? 'Get Started'}</Link>
						</Button>
						<Button
							asChild
							variant="ghost"
							size="lg"
							style={{
								color: 'rgba(254,248,236,0.8)',
								border: '1px solid rgba(254,248,236,0.2)',
								fontFamily: 'var(--font-body)'
							}}
						>
							<Link href={`/${locale}`}>{dictionary.landing?.learnMore ?? 'Learn More'}</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	)
}
