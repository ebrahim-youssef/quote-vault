'use client'
import { useActionState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Button } from '../../../components/ui/button'
import { signInAction } from '@/app/(auth)/actions/sign-in-action'

const initialState = { message: '' }

interface SignInProps {
	locale?: string
}
export default function SignIn({ locale = 'en' }: SignInProps) {
	const { t } = useTranslation()
	const [state, formAction] = useActionState(
		(prevState: { message: string } | undefined, formData: FormData) => signInAction(prevState, formData, locale),
		initialState
	)

	useEffect(() => {
		if (state?.message) {
			toast.error(state.message)
		}
	}, [state?.message])

	return (
		<form action={formAction} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
			<Input
				name="email"
				type="email"
				placeholder={t('auth.emailPlaceholder')}
				required
				className="text-sm sm:text-base"
				autoComplete="email"
				aria-label={t('auth.emailPlaceholder')}
			/>
			<Input
				name="password"
				type="password"
				placeholder={t('auth.passwordPlaceholder')}
				required
				className="text-sm sm:text-base"
				autoComplete="current-password"
				aria-label={t('auth.passwordPlaceholder')}
			/>
			<Button
				type="submit"
				variant="ghost"
				className="text-sm font-medium whitespace-nowrap rounded-[6px]"
				aria-label={t('auth.signIn')}
			>
				{t('auth.signIn')}
			</Button>
		</form>
	)
}
