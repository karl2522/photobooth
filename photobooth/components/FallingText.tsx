'use client'

import * as React from 'react'

type Drop = {
	id: string
	leftPercent: number
	delayMs: number
	durationMs: number
	fontSizeRem: number
	vertical: boolean
	rotateDeg: number
	gradient: [string, string]
}

const GRADIENTS: Array<[string, string]> = [
	['#fb7185', '#f472b6'], // rose → pink
	['#f472b6', '#ec4899'], // pink → fuchsia
	['#fca5a5', '#fb7185'], // soft red → rose
	['#a78bfa', '#f0abfc'], // violet → fuchsia-light
]

export default function FallingText() {
	// Avoid hydration mismatch by generating drops only on client after mount
	const [drops, setDrops] = React.useState<Drop[]>([])
	React.useEffect(() => {
		const count = 10
		const arr: Drop[] = []
		for (let i = 0; i < count; i++) {
			const left = Math.random() * 100
			const delay = Math.floor(Math.random() * 6000)
			const duration = 9000 + Math.floor(Math.random() * 6000)
			const fontSize = 0.8 + Math.random() * 0.9
			const vertical = false
			const rotateDeg = vertical ? 0 : (Math.random() < 0.5 ? -8 : 8)
			const gradient = GRADIENTS[i % GRADIENTS.length]
			arr.push({
				id: `drop-${i}`,
				leftPercent: left,
				delayMs: delay,
				durationMs: duration,
				fontSizeRem: fontSize,
				vertical,
				rotateDeg,
				gradient,
			})
		}
		setDrops(arr)
	}, [])

	return (
		<div className="absolute inset-0 pointer-events-none overflow-hidden">
			{drops.map((d) => (
				<span
					key={d.id}
					className="falling-text"
					style={{
						left: `${d.leftPercent}%`,
						top: '-10%',
						animationDuration: `${d.durationMs}ms`,
						animationDelay: `${d.delayMs}ms`,
						fontSize: `${d.fontSizeRem}rem`,
						fontWeight: 700,
						opacity: 0.85,
						// @ts-expect-error css var
						'--tw-rotate': `${d.rotateDeg}deg`,
						background: `linear-gradient(180deg, ${d.gradient[0]}, ${d.gradient[1]})`,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						color: 'transparent',
						letterSpacing: '0.02em',
						filter: 'drop-shadow(0 4px 8px rgba(236,72,153,0.12))',
					} as React.CSSProperties}
				>
					i love you, asereth
				</span>
			))}
		</div>
	)
}


