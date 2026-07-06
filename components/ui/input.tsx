import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					'flex h-9 w-full border border-input bg-transparent px-3 py-1 text-base transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-[var(--teal-500)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--teal-300)_35%,transparent)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
					'rounded-[var(--radius-sm)]',
					className
				)}
				ref={ref}
				{...props}
			/>
		)
	}
)
Input.displayName = 'Input'

export { Input }
