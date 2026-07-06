'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getDictionary } from '@/lib/get-dictionary'
import { LOCALE_HEADER } from '@/lib/consts'

interface CreateQuoteInput {
	quoteText: string
	author: string
	source?: string | null
	tags: string[]
	userId?: string
}

export async function createQuote(input: CreateQuoteInput) {
	const locale = (await headers()).get(LOCALE_HEADER) ?? 'en'
	const dict = await getDictionary(locale)
	try {
		const session = await auth()

		if (!session?.user?.id) {
			return {
				success: false,
				error: dict?.errors?.mustBeLoggedIn ?? 'You must be logged in to create a quote'
			}
		}

		const { quoteText, author, source, tags } = input

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
			const quote = await prisma.quote.create({
				data: {
					quoteText: quoteText.trim(),
					author: author.trim(),
					source: source?.trim() || null,
					tags: tags || [],
					userId: session.user.id
				}
			})

			revalidatePath(`/${locale}/dashboard`)

			return {
				success: true,
				data: quote
			}
		} catch (dbError) {
			console.error('Database error creating quote:', dbError)
			if (dbError instanceof Error && 'code' in dbError) {
				if (dbError.code === 'P2002') {
					return {
						success: false,
						error: dict?.errors?.alreadyExists ?? 'This quote already exists'
					}
				}
			}
			throw dbError
		}
	} catch (error) {
		console.error('Error creating quote:', error)
		return {
			success: false,
			error: dict?.errors?.failedCreate ?? 'Failed to create quote. Please try again.'
		}
	}
}
