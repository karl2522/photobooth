'use client'

import * as React from 'react'

type SectionCardProps = React.HTMLAttributes<HTMLDivElement> & {
	children: React.ReactNode
}

export default function SectionCard({ className, children, ...rest }: SectionCardProps) {
	return (
		<div
			className={[
				'bg-white/80 backdrop-blur-md rounded-2xl border border-pink-100/60 shadow-md',
				className,
			]
				.filter(Boolean)
				.join(' ')}
			{...rest}
		>
			{children}
		</div>
	)
}




