'use client'

import { useState, useTransition, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, Quote, AlertCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { createQuote } from '../actions/create-quote'

interface CreateQuoteModalProps {
	userId?: string
}

export function CreateQuoteModal({ userId }: CreateQuoteModalProps) {
	const { t } = useTranslation()
	const [isPending, startTransition] = useTransition()
	const [open, setOpen] = useState(false)
	const [quoteText, setQuoteText] = useState('')
	const [author, setAuthor] = useState('')
	const [source, setSource] = useState('')
	const [tags, setTags] = useState<string[]>([])
	const [currentTag, setCurrentTag] = useState('')
	const [error, setError] = useState<string | null>(null)

	if (!userId) {
		return (
			<Button disabled>
				<PlusCircle className="h-4 w-4" aria-hidden="true" />
				{t('addQuote.addButton')}
			</Button>
		)
	}

	const resetState = () => {
		setQuoteText('')
		setAuthor('')
		setSource('')
		setTags([])
		setCurrentTag('')
		setError(null)
	}

	const handleAddTag = () => {
		const trimmedTag = currentTag.trim().toLowerCase()
		if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 15) {
			setTags([...tags, trimmedTag])
			setCurrentTag('')
		}
	}

	const handleRemoveTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove))
	}

	const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddTag()
		}
	}

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(null)

		if (!quoteText.trim() || !author.trim()) {
			setError(t('addQuote.errorFill'))
			return
		}

		startTransition(async () => {
			try {
				const result = await createQuote({
					quoteText: quoteText.trim(),
					author: author.trim(),
					source: source.trim() || null,
					tags: tags,
					userId
				})

				if (!result.success) {
					setError(result.error ?? t('addQuote.errorCreate'))
					return
				}

				toast.success(t('addQuote.successCreated'))
				setOpen(false)
				resetState()
			} catch (err) {
				setError(t('addQuote.errorUnexpected'))
				console.error(err)
			}
		})
	}

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen)
		if (!newOpen) {
			resetState()
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant="default">
					<PlusCircle className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
					{t('addQuote.addButton')}
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-card">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Quote className="h-5 w-5" />
						{t('addQuote.title')}
					</DialogTitle>
					<DialogDescription>{t('addQuote.description')}</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="quoteText">
							{t('addQuote.quoteLabel')} <span className="text-destructive">*</span>
						</Label>
						<Textarea
							id="quoteText"
							placeholder={t('addQuote.quotePlaceholder')}
							value={quoteText}
							onChange={(event) => setQuoteText(event.target.value)}
							disabled={isPending}
							required
							rows={4}
							className="resize-none"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="author">
							{t('addQuote.authorLabel')} <span className="text-destructive">*</span>
						</Label>
						<Input
							id="author"
							placeholder={t('addQuote.authorPlaceholder')}
							value={author}
							onChange={(event) => setAuthor(event.target.value)}
							disabled={isPending}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="source">{t('addQuote.sourceLabel')}</Label>
						<Input
							id="source"
							placeholder={t('addQuote.sourcePlaceholder')}
							value={source}
							onChange={(event) => setSource(event.target.value)}
							disabled={isPending}
						/>
						<p className="text-xs text-muted-foreground">{t('addQuote.sourceHelp')}</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="tags">{t('addQuote.tagsLabel')}</Label>
						<div className="flex gap-2">
							<Input
								id="tags"
								placeholder={t('addQuote.tagsPlaceholder')}
								value={currentTag}
								onChange={(event) => setCurrentTag(event.target.value)}
								onKeyDown={handleTagKeyDown}
								disabled={isPending}
							/>
							<Button
								type="button"
								variant="outline"
								onClick={handleAddTag}
								disabled={isPending || !currentTag.trim()}
							>
								{t('addQuote.tagsAdd')}
							</Button>
						</div>

						{tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-2">
								{tags.map((tag) => (
									<span
										key={tag}
										className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
									>
										#{tag}
										<button
											type="button"
											onClick={() => handleRemoveTag(tag)}
											disabled={isPending}
											className="hover:text-destructive transition-colors"
										>
											<X className="h-3 w-3" aria-hidden="true" />
											<span className="sr-only">{t('addQuote.removeTag', { tag })}</span>
										</button>
									</span>
								))}
							</div>
						)}
					</div>

					{error && (
						<div role="alert" className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
							<AlertCircle className="h-4 w-4" />
							<span>{error}</span>
						</div>
					)}

					<div className="flex justify-end rtl:justify-start gap-2 pt-2">
						<DialogClose asChild>
							<Button type="button" variant="outline" disabled={isPending}>
								{t('addQuote.cancel')}
							</Button>
						</DialogClose>

						<Button type="submit" disabled={isPending}>
							{isPending ? t('addQuote.creating') : t('addQuote.saveQuote')}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
