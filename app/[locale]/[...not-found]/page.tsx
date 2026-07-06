import { notFound } from 'next/navigation'

export default async function NotFoundCatchAll({ params }: { params: Promise<{ locale: string }> }) {
	console.log('NotFoundCatchAll invoked with params:', (await params).locale)
	notFound()
}
