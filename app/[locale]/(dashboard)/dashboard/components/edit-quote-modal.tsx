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
import { Edit, Quote, AlertCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { updateQuote } from '../actions/edit-quote'
import { Switch } from '@/components/ui/switch'

interface EditQuoteModalProps {
	quote: {
		id: string
		quoteText: string
		author: string
		source?: string | null
		tags: string[]
		isPublic: boolean
	}
}

export function EditQuoteModal({ quote }: EditQuoteModalProps) {
	const { t } = useTranslation()
	const [isPending, startTransition] = useTransition()
	const [open, setOpen] = useState(false)
	const [quoteText, setQuoteText] = useState(quote.quoteText)
	const [author, setAuthor] = useState(quote.author)
	const [source, setSource] = useState(quote.source || '')
	const [tags, setTags] = useState<string[]>(quote.tags)
	const [currentTag, setCurrentTag] = useState('')
	const [isPublic, setIsPublic] = useState(quote.isPublic)
	const [error, setError] = useState<string | null>(null)
	const resetState = () => {
		setQuoteText(quote.quoteText)
		setAuthor(quote.author)
		setSource(quote.source || '')
		setTags(quote.tags)
		setCurrentTag('')
		setIsPublic(quote.isPublic)
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
			setError(t('editQuote.errorFill'))
			return
		}

		startTransition(async () => {
			try {
				const result = await updateQuote({
					id: quote.id,
					quoteText: quoteText.trim(),
					author: author.trim(),
					source: source.trim() || null,
					tags,
					isPublic
				})

				if (!result.success) {
					setError(result.error ?? t('editQuote.unexpected'))
					return
				}

				toast.success(t('editQuote.successUpdated'))
				setOpen(false)
			} catch (err) {
				setError(t('editQuote.unexpected'))
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
				<Button variant="default" size="sm" className="flex-1 flex items-center gap-2 rtl:flex-row-reverse">
					<Edit className="me-2 h-4 w-4 rtl:-scale-x-100" />
					{t('navigation.edit')}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg max-w-2xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Quote className="h-5 w-5" />
						{t('editQuote.title')}
					</DialogTitle>
					<DialogDescription>{t('editQuote.description')}</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Quote Text */}
					<div className="space-y-2">
						<Label htmlFor="quoteText">
							{t('editQuote.quoteLabel')} <span className="text-destructive">*</span>
						</Label>
						<Textarea
							id="quoteText"
							placeholder={t('editQuote.quotePlaceholder')}
							value={quoteText}
							onChange={(event) => setQuoteText(event.target.value)}
							disabled={isPending}
							required
							rows={4}
							className="resize-none"
						/>
					</div>

					{/* Author */}
					<div className="space-y-2">
						<Label htmlFor="author">
							{t('editQuote.authorLabel')} <span className="text-destructive">*</span>
						</Label>
						<Input
							id="author"
							placeholder={t('editQuote.authorPlaceholder')}
							value={author}
							onChange={(event) => setAuthor(event.target.value)}
							disabled={isPending}
							required
						/>
					</div>

					{/* Public */}
					<div className="space-y-2">
						<Label htmlFor="terms">
							{t('editQuote.isPublicLabel')} <span className="text-destructive">*</span>
						</Label>
						<div className="flex items-center gap-3">
							<Switch checked={isPublic} onCheckedChange={(checked) => setIsPublic(checked)} id="terms" />
							<Label htmlFor="terms">{t('editQuote.isPublicHelp')}</Label>
						</div>
					</div>

					{/* Source */}
					<div className="space-y-2">
						<Label htmlFor="source">{t('editQuote.sourceLabel')}</Label>
						<Input
							id="source"
							placeholder={t('editQuote.sourcePlaceholder')}
							value={source}
							onChange={(event) => setSource(event.target.value)}
							disabled={isPending}
						/>
						<p className="text-xs text-muted-foreground">{t('editQuote.sourceHelp')}</p>
					</div>

					{/* Tags */}
					<div className="space-y-2">
						<Label htmlFor="tags">{t('editQuote.tagsLabel')}</Label>
						<div className="flex gap-2">
							<Input
								id="tags"
								placeholder={t('editQuote.tagsPlaceholder')}
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
								{t('editQuote.tagsAdd')}
							</Button>
						</div>

						{/* Display Tags */}
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
											<X className="h-3 w-3" />
										</button>
									</span>
								))}
							</div>
						)}
					</div>

					{/* Error Message */}
					{error && (
						<div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
							<AlertCircle className="h-4 w-4" />
							<span>{error}</span>
						</div>
					)}

					{/* Actions */}
					<div className="flex justify-end rtl:justify-start gap-2 pt-2">
						<DialogClose asChild>
							<Button type="button" variant="outline" disabled={isPending}>
								{t('editQuote.cancel')}
							</Button>
						</DialogClose>

						<Button type="submit" disabled={isPending}>
							{isPending ? t('editQuote.updating') : t('editQuote.saveChanges')}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
