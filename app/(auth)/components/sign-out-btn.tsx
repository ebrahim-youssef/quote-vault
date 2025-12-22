import { signOut } from '@/lib/auth'
import { Button } from '../../../components/ui/button'
import { getDictionary } from '@/lib/get-dictionary'

interface SignOutProps {
	locale?: string
}

export default async function SignOut({ locale = 'en' }: SignOutProps) {
	const dict = await getDictionary(locale)

	return (
		<form
			action={async () => {
				'use server'
				await signOut({ redirectTo: `/${locale}` })
			}}
		>
			<Button type="submit" variant="ghost" className="text-sm sm:text-base" aria-label="Sign out from account">
				{dict?.auth?.signOut ?? 'Sign Out'}
			</Button>
		</form>
	)
}
