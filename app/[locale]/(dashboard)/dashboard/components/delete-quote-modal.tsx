'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Trash2, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { deleteQuote } from '../actions/delete-quote'

interface DeleteQuoteModalProps {
	quoteId: string
	quoteText: string
}

export function DeleteQuoteModal({ quoteId, quoteText }: DeleteQuoteModalProps) {
	const { t } = useTranslation()
	const [isPending, startTransition] = useTransition()
	const [open, setOpen] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleDelete = () => {
		setError(null)

		startTransition(async () => {
			try {
				const result = await deleteQuote({ id: quoteId })

				if (!result.success) {
					setError(result.error ?? t('deleteQuote.errorDelete'))
					return
				}

				toast.success(t('deleteQuote.successDeleted'))
				setOpen(false)
			} catch (err) {
				setError(t('deleteQuote.unexpected'))
				console.error(err)
			}
		})
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" size="sm" className="flex-1 flex items-center gap-2 rtl:flex-row-reverse">
					<Trash2 className="me-2 h-4 w-4 rtl:-scale-x-100" />
					{t('navigation.delete')}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t('deleteQuote.title')}</AlertDialogTitle>
					<AlertDialogDescription className="space-y-2">
						<p>{t('deleteQuote.description')}</p>
						<div className="mt-4 p-4 rounded-lg bg-muted border border-border">
							<p className="text-sm text-foreground italic">
								&quot;{quoteText.length > 100 ? quoteText.substring(0, 100) + '...' : quoteText}&quot;
							</p>
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>

				{error && (
					<div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
						<AlertCircle className="h-4 w-4" />
						<span>{error}</span>
					</div>
				)}

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>{t('deleteQuote.cancel')}</AlertDialogCancel>
					<AlertDialogAction
						onClick={(e) => {
							e.preventDefault()
							handleDelete()
						}}
						disabled={isPending}
						className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
					>
						{isPending ? t('deleteQuote.deleting') : t('deleteQuote.deleteAction')}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
