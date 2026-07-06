import Link from 'next/link'
import ThemeToggleBtn from './theme-toggle-btn'
import { auth } from '@/lib/auth'
import SignOut from '@/app/(auth)/components/sign-out-btn'
import SignIn from '@/app/(auth)/components/sign-in-btn'
import { getDictionary } from '@/lib/get-dictionary'
import LanguageSwitcher from './lang-switcher'

interface HeaderProps {
	locale?: string
}

export default async function Header({ locale = 'en' }: HeaderProps) {
	const session = await auth()
	const dictionary = await getDictionary(locale)

	const localizedHome = `/${locale}`
	const localizedDashboard = `/${locale}/dashboard`

	return (
		<header
			className="sticky top-0 z-50 w-full border-b border-border"
			style={{ background: 'var(--header-bg)', backdropFilter: 'blur(10px)' }}
		>
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
				<div className="flex items-center justify-between">
					{/* Brand mark */}
					<Link
						href={localizedHome}
						className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 rounded-sm"
						aria-label={`${dictionary?.branding?.name ?? 'Quote Vault'} home`}
					>
						<span
							className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] text-sm font-bold flex-shrink-0 bg-primary text-primary-foreground"
							style={{ fontFamily: 'var(--font-display)' }}
						>
							QV
						</span>
						<span
							className="text-lg font-bold transition-colors group-hover:text-gold-500"
							style={{ fontFamily: 'var(--font-display)', color: 'var(--nav-brand)' }}
						>
							{dictionary?.branding?.name ?? 'Quote Vault'}
						</span>
					</Link>

					{/* Desktop nav */}
					<nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
						{session?.user?.name ? (
							<>
								<Link
									href={localizedDashboard}
									className="px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] transition-colors hover:text-gold-500"
									style={{ color: 'var(--nav-link)' }}
								>
									{session.user.name}
								</Link>
								<SignOut locale={locale} />
							</>
						) : (
							<SignIn locale={locale} />
						)}
						<ThemeToggleBtn />
						<LanguageSwitcher />
					</nav>

					{/* Mobile nav */}
					<div className="md:hidden flex items-center gap-1.5">
						{session?.user?.name ? (
							<>
								<Link
									href={localizedDashboard}
									className="text-xs font-medium px-2 py-1 rounded-[var(--radius-sm)] transition-colors hover:text-gold-500"
									style={{ color: 'var(--nav-link)' }}
								>
									{session.user.name.split(' ')[0]}
								</Link>
								<SignOut locale={locale} />
							</>
						) : (
							<SignIn locale={locale} />
						)}
						<ThemeToggleBtn />
						<LanguageSwitcher />
					</div>
				</div>
			</div>
		</header>
	)
}
