import Link from 'next/link'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { getDictionary } from '@/lib/get-dictionary'
import { brand } from '@/lib/consts'

interface FooterProps {
	locale?: string
}

export default async function Footer({ locale = 'en' }: FooterProps) {
	const currentYear = new Date().getFullYear()
	const dictionary = await getDictionary(locale)

	const localizedHome = `/${locale}`
	const localizedDashboard = `/${locale}/dashboard`

	return (
		<footer
			className="ia-pattern-bg w-full relative"
			style={{ background: 'var(--teal-900)', color: 'var(--cream)' }}
			role="contentinfo"
		>
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
				{/* Main footer content */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
					{/* Brand */}
					<div className="flex flex-col gap-3">
						<Link
							href={localizedHome}
							className="flex items-center gap-2.5 w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 rounded-sm"
							aria-label={`${dictionary?.branding?.name ?? 'Quote Vault'} home`}
						>
							<span
								className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] text-xs font-bold flex-shrink-0"
								style={{
									background: 'rgba(254,248,236,0.12)',
									color: 'var(--cream)',
									fontFamily: 'var(--font-display)'
								}}
							>
								QV
							</span>
							<span
								className="text-base font-bold"
								style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}
							>
								{dictionary?.branding?.name ?? 'Quote Vault'}
							</span>
						</Link>
						<p
							className="text-xs"
							style={{ color: 'rgba(254,248,236,0.6)', fontFamily: 'var(--font-body)' }}
						>
							{dictionary?.footer?.tagline ?? 'Warm. Grounded. Intentional.'}
						</p>
						<p
							className="text-sm"
							style={{ color: 'rgba(254,248,236,0.75)', fontFamily: 'var(--font-body)' }}
						>
							{dictionary?.footer?.brandDescription ?? 'Save, organize, and share your favorite quotes.'}
						</p>
					</div>

					{/* Social */}
					<div className="flex flex-col gap-4">
						<h3
							className="text-xs font-semibold uppercase tracking-widest"
							style={{
								color: 'var(--gold-300)',
								fontFamily: 'var(--font-body)',
								letterSpacing: '0.12em'
							}}
						>
							{dictionary?.footer?.followUs ?? 'Follow Us'}
						</h3>
						<nav className="flex items-center gap-2" aria-label="Social media links">
							{brand.twitter && (
								<Link
									href={brand.twitter}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Twitter"
									className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] transition-all duration-[120ms] hover:scale-105"
									style={{ background: 'rgba(254,248,236,0.08)', color: 'var(--cream)' }}
								>
									<FaTwitter className="h-4 w-4" aria-hidden="true" />
								</Link>
							)}
							{brand.github && (
								<Link
									href={brand.github}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="GitHub"
									className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] transition-all duration-[120ms] hover:scale-105"
									style={{ background: 'rgba(254,248,236,0.08)', color: 'var(--cream)' }}
								>
									<FaGithub className="h-4 w-4" aria-hidden="true" />
								</Link>
							)}
							{brand.linkedin && (
								<Link
									href={brand.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="LinkedIn"
									className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] transition-all duration-[120ms] hover:scale-105"
									style={{ background: 'rgba(254,248,236,0.08)', color: 'var(--cream)' }}
								>
									<FaLinkedin className="h-4 w-4" aria-hidden="true" />
								</Link>
							)}
						</nav>
					</div>

					{/* Navigation */}
					<div className="flex flex-col gap-4">
						<h3
							className="text-xs font-semibold uppercase tracking-widest"
							style={{
								color: 'var(--gold-300)',
								fontFamily: 'var(--font-body)',
								letterSpacing: '0.12em'
							}}
						>
							{dictionary?.footer?.navigation ?? 'Navigation'}
						</h3>
						<nav className="flex flex-col gap-1.5" aria-label="Footer navigation">
							<Link
								href={localizedHome}
								className="footer-nav-link text-sm w-fit py-1 transition-colors"
							>
								{dictionary?.common?.home ?? 'Home'}
							</Link>
							<Link
								href={localizedDashboard}
								className="footer-nav-link text-sm w-fit py-1 transition-colors"
							>
								{dictionary?.common?.dashboard ?? 'Dashboard'}
							</Link>
						</nav>
					</div>
				</div>

				{/* Diamond lattice divider */}
				<hr className="ia-divider" style={{ opacity: 0.3 }} aria-hidden="true" />

				{/* Bottom bar */}
				<div className="flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-xs" style={{ color: 'rgba(254,248,236,0.5)', fontFamily: 'var(--font-body)' }}>
						&copy; {currentYear} {dictionary?.branding?.name ?? 'Quote Vault'} &middot; {dictionary?.footer?.builtWithCare ?? 'Built with care'}
					</p>
					<nav className="flex items-center gap-5" aria-label="Legal">
						<Link href="#" className="text-xs transition-colors" style={{ color: 'rgba(254,248,236,0.5)' }}>
							{dictionary?.footer?.privacy ?? 'Privacy'}
						</Link>
						<Link href="#" className="text-xs transition-colors" style={{ color: 'rgba(254,248,236,0.5)' }}>
							{dictionary?.footer?.terms ?? 'Terms'}
						</Link>
					</nav>
				</div>
			</div>
		</footer>
	)
}
