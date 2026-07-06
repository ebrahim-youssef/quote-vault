'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getDictionary } from '@/lib/get-dictionary'
import { LOCALE_HEADER } from '@/lib/consts'

interface UpdateQuoteInput {
	id: string
	quoteText: string
	author: string
	source?: string | null
	tags: string[]
	isPublic?: boolean
}

export async function updateQuote(input: UpdateQuoteInput) {
	const locale = (await headers()).get(LOCALE_HEADER) ?? 'en'
	const dict = await getDictionary(locale)
	try {
		const session = await auth()

		if (!session?.user?.id) {
			return {
				success: false,
				error: dict?.errors?.mustBeLoggedIn ?? 'You must be logged in to update a quote'
			}
		}

		const { id, quoteText, author, source, tags, isPublic } = input

		if (!id || typeof id !== 'string' || id.trim().length === 0) {
			return {
				success: false,
				error: dict?.errors?.invalidId ?? 'Invalid quote ID'
			}
		}

		if (!quoteText?.trim() || !author?.trim()) {
			return {
				success: false,
				error: dict?.errors?.invalidFields ?? 'Quote text and author are required'
			}
		}

		if (tags && tags.length > 15) {
			return {
				success: false,
				error: dict?.errors?.maxTags ?? 'Maximum 15 tags allowed'
			}
		}

		try {
			const existingQuote = await prisma.quote.findUnique({
				where: { id },
				select: { userId: true }
			})

			if (!existingQuote) {
				return {
					success: false,
					error: dict?.errors?.quoteNotFound ?? 'Quote not found'
				}
			}

			if (existingQuote.userId !== session.user.id) {
				return {
					success: false,
					error: dict?.errors?.noPermission ?? 'You do not have permission to update this quote'
				}
			}

			const quote = await prisma.quote.update({
				where: { id },
				data: {
					quoteText: quoteText.trim(),
					author: author.trim(),
					source: source?.trim() || null,
					tags: tags || [],
					isPublic
				}
			})

			revalidatePath(`/${locale}/dashboard`)

			return {
				success: true,
				data: quote
			}
		} catch (dbError) {
			console.error('Database error updating quote:', dbError)
			if (dbError instanceof Error && 'code' in dbError) {
				if (dbError.code === 'P2025') {
					return {
						success: false,
						error: 'Quote not found'
					}
				}
			}
			throw dbError
		}
	} catch (error) {
		console.error('Error updating quote:', error)
		return {
			success: false,
			error: dict?.errors?.failedUpdate ?? 'Failed to update quote. Please try again.'
		}
	}
}
