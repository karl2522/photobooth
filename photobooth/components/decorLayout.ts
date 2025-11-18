export type Edge = 'top' | 'bottom' | 'left' | 'right'

export type DecorPoint = {
	edge: Edge
	percent: number // 0..100 along the edge
	sizeScale: number // multiplier on base size
	rotationDeg: number
}

// Returns a rich, not-too-plain layout used by both preview UI and canvas export.
export function getDecorLayout(sticker: string): DecorPoint[] {
	// Reduced density but larger feel
	const top = [12, 50, 88] // three across top/bottom
	const side = [25, 55, 85] // three along each side
	const sizeCycle = [1.08, 1, 1.12, 1.06]
	const rotCycle = [0, -8, 6, -6]

	const make = (edge: Edge, percents: number[]) =>
		percents.map((p, i) => ({
			edge,
			percent: p,
			sizeScale: sizeCycle[i % sizeCycle.length],
			rotationDeg: rotCycle[i % rotCycle.length],
		}))

	let layout = [
		...make('top', top),
		...make('bottom', top),
		...make('left', side),
		...make('right', side),
	]

	// Slight variations per sticker style
	if (sticker === 'flowers') {
		layout = layout.map((d, i) => ({
			...d,
			sizeScale: d.sizeScale * (i % 2 ? 1.2 : 1.1),
			rotationDeg: d.rotationDeg + (i % 3 === 0 ? 4 : 0),
		}))
	} else if (sticker === 'bows') {
		layout = layout.map((d) => ({ ...d, sizeScale: d.sizeScale * 1.15, rotationDeg: d.rotationDeg * 0.7 }))
	} else if (sticker === 'butterflies') {
		layout = layout.map((d) => ({ ...d, sizeScale: d.sizeScale * 1.12 }))
	} else if (sticker === 'ribbons') {
		layout = layout.map((d) => ({ ...d, sizeScale: d.sizeScale * 1.1 }))
	} else if (sticker === 'pearls') {
		layout = layout.map((d) => ({ ...d, sizeScale: d.sizeScale * 1.08, rotationDeg: 0 }))
	}

	return layout
}


