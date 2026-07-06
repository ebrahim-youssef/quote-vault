'use server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getDictionary } from '@/lib/get-dictionary'
import { LOCALE_HEADER } from '@/lib/consts'

interface DeleteQuoteInput {
	id: string
}

export async function deleteQuote(input: DeleteQuoteInput) {
	const locale = (await headers()).get(LOCALE_HEADER) ?? 'en'
	const dict = await getDictionary(locale)
	try {
		const session = await auth()

		if (!session?.user?.id) {
			return {
				success: false,
				error: dict?.errors?.mustBeLoggedIn ?? 'You must be logged in to delete a quote'
			}
		}

		const { id } = input

		if (!id || typeof id !== 'string' || id.trim().length === 0) {
			return {
				success: false,
				error: dict?.errors?.invalidId ?? 'Invalid quote ID'
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
					error: dict?.errors?.noPermission ?? 'You do not have permission to delete this quote'
				}
			}

			await prisma.quote.delete({
				where: { id }
			})

			revalidatePath(`/${locale}/dashboard`)

			return {
				success: true
			}
		} catch (dbError) {
			console.error('Database error deleting quote:', dbError)
			if (dbError instanceof Error && 'code' in dbError) {
				if (dbError.code === 'P2025') {
					return {
						success: false,
						error: dict?.errors?.quoteNotFound ?? 'Quote not found'
					}
				}
			}
			throw dbError
		}
	} catch (error) {
		console.error('Error deleting quote:', error)
		return {
			success: false,
			error: dict?.errors?.failedDelete ?? 'Failed to delete quote. Please try again.'
		}
	}
}
