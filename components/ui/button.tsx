import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground rounded-[var(--radius-sm)] shadow-sm hover:bg-primary/85 active:translate-y-px active:scale-[0.99]',
				destructive:
					'bg-destructive text-destructive-foreground rounded-[var(--radius-sm)] shadow-sm hover:bg-destructive/90',
				outline:
					'border-2 border-[var(--gold-500)] bg-transparent text-[var(--gold-600)] rounded-[var(--radius-sm)] hover:bg-[color-mix(in_srgb,var(--gold-500)_12%,transparent)]',
				secondary:
					'bg-secondary text-secondary-foreground rounded-[var(--radius-sm)] shadow-sm hover:bg-secondary/80',
				ghost: 'rounded-[var(--radius-sm)] text-foreground hover:bg-[color-mix(in_srgb,var(--gold-500)_10%,transparent)] hover:text-[var(--teal-700)]',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 px-3 text-xs',
				lg: 'h-11 px-7 text-base',
				icon: 'h-10 w-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'
		return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }
