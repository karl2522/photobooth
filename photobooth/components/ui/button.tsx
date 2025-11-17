'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'

type ButtonVariant = 'default' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	/**
	 * If true, renders the button with reduced opacity and disables interaction.
	 */
	isLoading?: boolean
	variant?: ButtonVariant
	size?: ButtonSize
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			isLoading = false,
			disabled,
			children,
			variant = 'default',
			size = 'md',
			...props
		},
		ref
	) => {
		const variantClasses =
			variant === 'outline'
				? 'bg-white text-black border border-gray-300 hover:bg-gray-50'
				: variant === 'ghost'
				? 'bg-transparent text-black hover:bg-black/5'
				: 'bg-black text-white hover:bg-black/90'

		const sizeClasses =
			size === 'sm'
				? 'px-3 py-1.5 text-sm'
				: size === 'lg'
				? 'px-6 py-3 text-base'
				: 'px-4 py-2 text-sm'

		return (
			<button
				ref={ref}
				aria-disabled={isLoading || disabled}
				disabled={isLoading || disabled}
				className={cn(
					'inline-flex items-center justify-center rounded-md transition-colors',
					'disabled:opacity-50 disabled:pointer-events-none',
					variantClasses,
					sizeClasses,
					className
				)}
				{...props}
			>
				{children}
			</button>
		)
	}
)
Button.displayName = 'Button'

export default Button


