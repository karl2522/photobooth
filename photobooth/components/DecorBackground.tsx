'use client'

import * as React from 'react'
import { Sparkles, Heart } from 'lucide-react'

type DecorBackgroundProps = {
	className?: string
	showIcons?: boolean
}

export default function DecorBackground({ className, showIcons = true }: DecorBackgroundProps) {
	return (
		<div className={['absolute inset-0 overflow-hidden pointer-events-none', className].filter(Boolean).join(' ')}>
			<div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(244,114,182,0.12),transparent_60%),radial-gradient(800px_400px_at_90%_80%,rgba(251,113,133,0.12),transparent_60%)]" />
			<div className="absolute top-10 left-10 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl animate-pulse-glow" />
			<div className="absolute bottom-20 right-10 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
			<div className="absolute top-1/2 right-1/4 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
			{showIcons && (
				<>
					<Sparkles className="absolute top-8 right-1/3 w-6 h-6 text-pink-400 animate-float hidden md:block" />
					<Heart className="absolute bottom-12 left-1/4 w-6 h-6 text-rose-400 animate-pop hidden md:block" />
				</>
			)}
		</div>
	)
}




