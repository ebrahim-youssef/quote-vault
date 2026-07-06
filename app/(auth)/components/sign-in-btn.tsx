'use client'
import { useState, useActionState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Button } from '../../../components/ui/button'
import { signInAction } from '@/app/(auth)/actions/sign-in-action'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { LogIn } from 'lucide-react'

const initialState = { message: '' }

interface SignInProps {
	locale?: string
}

export default function SignIn({ locale = 'en' }: SignInProps) {
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)
	const [state, formAction] = useActionState(
		(prevState: { message: string } | undefined, formData: FormData) => signInAction(prevState, formData, locale),
		initialState
	)

	useEffect(() => {
		if (state?.message) {
			toast.error(state.message)
		}
	}, [state])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default" size="sm" className="gap-1.5">
					<LogIn className="h-4 w-4" aria-hidden="true" />
					{t('auth.signIn')}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-sm bg-card">
				<DialogHeader>
					<DialogTitle style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
						{t('auth.signInTitle')}
					</DialogTitle>
					<DialogDescription>
						{t('auth.signInDescription')}
					</DialogDescription>
				</DialogHeader>
				<form action={formAction} className="flex flex-col gap-4 mt-1">
					<div className="space-y-1.5">
						<Label htmlFor="signin-email">{t('auth.emailPlaceholder')}</Label>
						<Input
							id="signin-email"
							name="email"
							type="email"
							placeholder={t('auth.emailPlaceholder')}
							required
							autoComplete="email"
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="signin-password">{t('auth.passwordPlaceholder')}</Label>
						<Input
							id="signin-password"
							name="password"
							type="password"
							placeholder={t('auth.passwordPlaceholder')}
							required
							autoComplete="current-password"
						/>
					</div>
					<Button type="submit" className="w-full mt-1">
						{t('auth.signIn')}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
