import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { CreateQuoteModal } from './components/add-quote-modal'
import { EditQuoteModal } from './components/edit-quote-modal'
import { DeleteQuoteModal } from './components/delete-quote-modal'
import { getDictionary } from '@/lib/get-dictionary'
import { QuoteCard } from '@/components/shared/quote-card'
import { redirect } from 'next/navigation'

const getQuotes = async (userId: string) => {
	try {
		const quotes = await prisma.quote.findMany({
			where: { userId },
			select: {
				user: { select: { name: true } },
				id: true,
				quoteText: true,
				author: true,
				source: true,
				tags: true,
				isPublic: true
			},
			orderBy: { createdAt: 'desc' }
		})
		return quotes || []
	} catch (error) {
		console.error('Error fetching user quotes:', error)
		return []
	}
}

interface DashboardPageProps {
	params: Promise<{ locale: string }>
}

export default async function Dashboard({ params }: DashboardPageProps) {
	const { locale } = await params
	const dictionary = await getDictionary(locale)
	const session = await auth()

	if (!session?.user?.id) {
		redirect(`/${locale}`)
	}

	const quotes = await getQuotes(session.user.id)
	const initials =
		session.user.name
			?.split(' ')
			.map((w) => w.at(0))
			.filter((c): c is string => Boolean(c))
			.slice(0, 2)
			.join('')
			.toUpperCase() || 'U'

	return (
		<div className="min-h-screen bg-background">
			{/* ── Profile header ──────────────────────────────────────── */}
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
					<div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
						{/* Avatar */}
						<div className="flex-shrink-0">
							<div
								className="flex items-center justify-center w-24 h-24 rounded-full font-extrabold text-3xl bg-primary text-primary-foreground"
								style={{
									border: '3px solid var(--cream)',
									boxShadow: 'var(--shadow-md)',
									fontFamily: 'var(--font-display)'
								}}
							>
								{initials}
							</div>
						</div>

						{/* Name + email + stats */}
						<div className="flex-1 min-w-0">
							<h1
								className="font-extrabold mb-1 truncate tracking-tight"
								style={{
									fontFamily: 'var(--font-display)',
									fontSize: 'clamp(22px, 3vw, 30px)',
									color: 'var(--teal-700)'
								}}
							>
								{session?.user?.name || (dictionary?.common?.user ?? 'User')}
							</h1>
							<p className="text-sm mb-4 text-muted-foreground">
								{session?.user?.email}
							</p>
							<div className="flex items-center gap-6">
								<div>
									<p
										className="font-extrabold leading-none text-3xl"
										style={{ fontFamily: 'var(--font-display)', color: 'var(--teal-700)' }}
									>
										{quotes.length}
									</p>
									<p className="text-xs mt-1 text-muted-foreground">
										{dictionary?.dashboard?.quotesCollected ?? 'Quotes Collected'}
									</p>
								</div>
								<div className="h-8 w-px bg-border" aria-hidden="true" />
								<div>
									<p
										className="font-extrabold leading-none text-3xl"
										style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-500)' }}
									>
										{quotes.filter((q) => q.isPublic).length}
									</p>
									<p className="text-xs mt-1 text-muted-foreground">
										{dictionary?.dashboard?.publicQuotes ?? 'Public Quotes'}
									</p>
								</div>
							</div>
						</div>

						{/* Create button — pushed to end in both LTR and RTL */}
						<div className="flex-shrink-0 sm:ms-auto">
							<CreateQuoteModal userId={session?.user.id} />
						</div>
					</div>
				</div>
			</section>

			{/* ── Quotes grid ─────────────────────────────────────────── */}
			<section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
				{quotes.length > 0 ? (
					<>
						<div className="mb-8">
							<span className="eyebrow block mb-2">{dictionary?.dashboard?.collection ?? 'Collection'}</span>
							<h2
								className="font-bold"
								style={{
									fontFamily: 'var(--font-display)',
									fontSize: 'clamp(22px, 3vw, 28px)',
									color: 'var(--teal-700)'
								}}
							>
								{dictionary?.dashboard?.yourQuotes ?? 'Your Quotes'}
							</h2>
							<p className="text-sm mt-1 text-muted-foreground">
								{dictionary?.dashboard?.manageCollection ?? 'Manage your collection of quotes'}
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
							{quotes.map((quote) => (
								<QuoteCard
									key={quote.id}
									quote={quote.quoteText}
									author={quote.author}
									source={quote.source}
									tags={quote.tags}
									userName={quote.user.name}
									isPublic={quote.isPublic}
								>
									<EditQuoteModal quote={quote} />
									<DeleteQuoteModal quoteId={quote.id} quoteText={quote.quoteText} />
								</QuoteCard>
							))}
						</div>
					</>
				) : (
					/* Empty state */
					<div
						className="ia-pattern-bg relative flex flex-col items-center text-center py-16 px-8 max-w-lg mx-auto overflow-hidden bg-card border border-border"
						style={{
							borderRadius: 'var(--radius-xl)',
							boxShadow: 'var(--shadow-sm)'
						}}
					>
						<span className="ia-star-accent" aria-hidden="true" />
						<div
							className="select-none pointer-events-none leading-none mb-2 font-extrabold text-[96px]"
							style={{
								fontFamily: 'var(--font-display)',
								color: 'var(--teal-700)',
								opacity: 0.08,
								lineHeight: 1
							}}
							aria-hidden="true"
						>
							&ldquo;
						</div>
						<span className="eyebrow block mb-3">
							{dictionary?.dashboardEmpty?.startBuilding ?? 'Start building'}
						</span>
						<h2
							className="font-bold mb-3 text-2xl"
							style={{ fontFamily: 'var(--font-display)', color: 'var(--teal-700)' }}
						>
							{dictionary?.dashboardEmpty?.noQuotesTitle ?? 'No quotes yet'}
						</h2>
						<p
							className="text-sm mb-8 text-muted-foreground max-w-[34ch]"
						>
							{dictionary?.dashboardEmpty?.noQuotesDescription ??
								'Start building your quote collection by creating your first quote.'}
						</p>
						<CreateQuoteModal userId={session?.user.id} />
					</div>
				)}
			</section>
		</div>
	)
}
