'use server'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import NavigateBackBtn from '@/components/shared/navigate-back-btn'
import { headers } from 'next/headers'
import { getDictionary } from '@/lib/get-dictionary'
import { LOCALE_HEADER } from '@/lib/consts'

export default async function DashboardNotFound() {
	const headersList = await headers()
	const locale = headersList.get(LOCALE_HEADER) || 'en'

	const dictionary = await getDictionary(locale)

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<Card className="w-full max-w-md border border-border">
				<CardHeader className="text-center space-y-4">
					<div className="text-6xl font-bold text-muted-foreground">404</div>
					<CardTitle className="text-2xl serif">
						{dictionary?.notFound?.pageTitle ?? 'Page Not Found'}
					</CardTitle>
					<CardDescription>
						{dictionary?.notFound?.dashboardMissing ??
							"The dashboard page you're looking for doesn't exist."}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex gap-3">
					<NavigateBackBtn />
					<Button asChild className="flex-1">
						<Link href={`/${locale}/dashboard`}>{dictionary?.common?.dashboard ?? 'Dashboard'}</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
