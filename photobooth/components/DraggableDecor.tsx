'use client'

import * as React from 'react'
import { Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

type ItemType = 'camera' | 'film' | 'polaroid'

type DecorItem = {
	id: string
	type: ItemType
	x: number
	y: number
	rotation: number
	color: 'pink' | 'rose' | 'white'
}

const INITIAL_ITEMS: DecorItem[] = []

export default function DraggableDecor() {
	const containerRef = React.useRef<HTMLDivElement | null>(null)
	const [items, setItems] = React.useState<DecorItem[]>(INITIAL_ITEMS)

	// Scatter a bunch of items across the camera area on mount
	React.useEffect(() => {
		const rect = containerRef.current?.getBoundingClientRect()
		const width = rect?.width ?? 900
		const height = rect?.height ?? 500
		const types: ItemType[] = ['camera', 'film', 'polaroid']
		const colors: Array<DecorItem['color']> = ['pink', 'rose', 'white']
		const next: DecorItem[] = []
		// Add a row of extra photo strips along the top area
		const topStrips = 6
		for (let i = 0; i < topStrips; i++) {
			// Keep strips away from the center title region (approx middle 30%)
			const leftBand = i % 2 === 0
			const minX = leftBand ? 0.05 * width : 0.65 * width
			const maxX = leftBand ? 0.35 * width : 0.95 * width
			const x = (minX + Math.random() * (maxX - minX)) + (Math.random() * 20 - 10)
			const y = 24 + Math.random() * 32
			next.push({
				id: `top-film-${i}`,
				type: 'film',
				x: Math.max(0, Math.min(width - 80, x)),
				y,
				rotation: Math.round(Math.random() * 10 - 5),
				color: i % 2 === 0 ? 'pink' : 'rose',
			})
		}
		// Then scatter a larger set across the area
		const count = 14
		for (let i = 0; i < count; i++) {
			const type = types[i % types.length]
			const color = colors[(i + 1) % colors.length]
			let x = Math.max(0, Math.min(width - 100, Math.random() * width))
			let y = Math.max(0, Math.min(height - 120, Math.random() * height))
			// If near the very top center, nudge left or right to avoid title overlap
			const centerMin = 0.35 * width
			const centerMax = 0.65 * width
			if (y < 110 && x > centerMin && x < centerMax) {
				x = x < (width / 2) ? centerMin - 40 : centerMax + 40
			}
			// Exclude central camera viewport region (roughly middle 60% width x 50% height)
			const excl = { x1: 0.2 * width, x2: 0.8 * width, y1: 0.25 * height, y2: 0.75 * height }
			let attempts = 0
			while (x > excl.x1 && x < excl.x2 && y > excl.y1 && y < excl.y2 && attempts < 10) {
				x = Math.max(0, Math.min(width - 100, Math.random() * width))
				y = Math.max(0, Math.min(height - 120, Math.random() * height))
				attempts++
			}
			const rotation = Math.round(Math.random() * 24 - 12)
			next.push({ id: `it-${i}`, type, x, y, rotation, color })
		}
		setItems(next)
		// we only want to run once on mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Simple drag with inertia
	const velocities = React.useRef<Record<string, { vx: number; vy: number }>>({})
	const dragging = React.useRef<string | null>(null)
	const lastPos = React.useRef<{ x: number; y: number; t: number } | null>(null)

	const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val))

const onPointerDown = (e: React.PointerEvent, id: string) => {
	e.preventDefault()
	e.stopPropagation()
	dragging.current = id
	;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
	lastPos.current = { x: e.clientX, y: e.clientY, t: performance.now() }
}

	const onPointerMove = (e: React.PointerEvent) => {
		if (!dragging.current || !lastPos.current || !containerRef.current) return
		const id = dragging.current
		const prev = lastPos.current
		const now = { x: e.clientX, y: e.clientY, t: performance.now() }
		const dt = Math.max(16, now.t - prev.t)
		const dx = now.x - prev.x
		const dy = now.y - prev.y
		velocities.current[id] = { vx: dx / dt, vy: dy / dt }
		lastPos.current = now

		const rect = containerRef.current.getBoundingClientRect()
		setItems((curr) =>
			curr.map((it) =>
				it.id === id
					? {
							...it,
							x: clamp(it.x + dx, 0, rect.width - 80),
							y: clamp(it.y + dy, 0, rect.height - 80),
					  }
					: it
			)
		)
	}

	const onPointerUp = () => {
		if (!dragging.current || !containerRef.current) return
		const id = dragging.current
		dragging.current = null
		lastPos.current = null
		const rect = containerRef.current.getBoundingClientRect()

		// inertia (subtle physics)
		let { vx = 0, vy = 0 } = velocities.current[id] || {}
		vx *= 300
		vy *= 300
		const friction = 0.94
		const bounce = 0.6
		let raf: number
		const step = () => {
			setItems((curr) =>
				curr.map((it) => {
					if (it.id !== id) return it
					let nx = it.x + vx * 0.016
					let ny = it.y + vy * 0.016
					// bounds and bounce
					if (nx < 0) {
						nx = 0
						vx = -vx * bounce
					} else if (nx > rect.width - 80) {
						nx = rect.width - 80
						vx = -vx * bounce
					}
					if (ny < 0) {
						ny = 0
						vy = -vy * bounce
					} else if (ny > rect.height - 80) {
						ny = rect.height - 80
						vy = -vy * bounce
					}
					vx *= friction
					vy *= friction
					return { ...it, x: nx, y: ny }
				})
			)
			if (Math.hypot(vx, vy) > 2) {
				raf = requestAnimationFrame(step)
			}
		}
		raf = requestAnimationFrame(step)
	}

	return (
		<div
			ref={containerRef}
			className="pointer-events-none absolute inset-0 z-30"
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerCancel={onPointerUp}
		>
			{items.map((item) => (
				<div
					key={item.id}
					onPointerDown={(e) => onPointerDown(e, item.id)}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					onPointerCancel={onPointerUp}
					className="pointer-events-auto absolute select-none touch-none cursor-grab active:cursor-grabbing"
					style={{
						transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg)`,
						transition: dragging.current === item.id ? 'none' : 'transform 120ms ease-out',
					}}
				>
					{item.type === 'camera' ? (
						<div className="rounded-xl bg-white/90 backdrop-blur-sm border border-pink-200 shadow-lg p-2">
							<Camera className={cn('w-6 h-6', item.color === 'pink' ? 'text-pink-500' : 'text-rose-500')} />
						</div>
					) : item.type === 'film' ? (
						<div
							className={cn(
								'rounded-md shadow-md border p-1',
								item.color === 'rose' ? 'bg-rose-100/90 border-rose-200' : 'bg-pink-100/90 border-pink-200'
							)}
							style={{ width: 56, height: 22 }}
						>
							<div className="h-full w-full grid grid-cols-3 gap-1">
								<div className="bg-white/80 rounded-sm" />
								<div className="bg-white/80 rounded-sm" />
								<div className="bg-white/80 rounded-sm" />
							</div>
						</div>
					) : (
						<div className="rounded-lg bg-white shadow-lg border border-pink-200 p-1" style={{ width: 50 }}>
							<div className="bg-gradient-to-br from-pink-200 to-rose-200 rounded-md h-10" />
							<div className="h-1.5" />
						</div>
					)}
				</div>
			))}
		</div>
	)
}


