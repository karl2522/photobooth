'use client'

import * as React from 'react'
// We assume react-konva is installed; this component only renders on client
import { Stage, Layer, Rect, Image as KonvaImage, Group } from 'react-konva'

type FrameColor = {
	id: string
	name: string
	color: string
	border: string
	gradientFrom?: string
	gradientTo?: string
}

type Props = {
	images: string[]
	frameColor: FrameColor
	width?: number // outer width; default 250 to match desired preview
}

function useHTMLImage(src?: string) {
	const [img, setImg] = React.useState<HTMLImageElement | null>(null)
	React.useEffect(() => {
		if (!src) return
		const image = new window.Image()
		image.crossOrigin = 'anonymous'
		image.src = src
		image.onload = () => setImg(image)
	}, [src])
	return img
}

export default function KonvaPreview({ images, frameColor, width = 250 }: Props) {
	// Match export sizing
	const outerWidth = width
	const cardPadding = 12
	const innerPadding = 12
	const contentWidth = outerWidth - 2 * (cardPadding + innerPadding)
	const photoWidth = contentWidth
	const photoHeight = Math.round((contentWidth * 3) / 4) // 4:3 tiles
	const spacing = 6
	const footerHeight = 28
	const photosHeight =
		photoHeight * images.length + spacing * Math.max(0, images.length - 1)
	const frameX = cardPadding
	const frameY = cardPadding
	const frameW = outerWidth - cardPadding * 2
	const frameH = photosHeight
	const height =
		cardPadding * 2 + innerPadding * 2 + photosHeight + footerHeight

	// Preload images
	const imgs = images.map((src) => useHTMLImage(src))

	return (
		<Stage width={outerWidth} height={height}>
			<Layer>
				{/* Outer background/frame color */}
				<Rect
					x={0}
					y={0}
					width={outerWidth}
					height={height}
					fill={frameColor.color}
				/>
				{/* Inner frame background (same color/gradient) */}
				<Rect
					x={frameX}
					y={frameY}
					width={frameW}
					height={frameH}
					fill={frameColor.gradientFrom && frameColor.gradientTo ? undefined : frameColor.color}
					fillLinearGradientStartPoint={{ x: frameX, y: frameY }}
					fillLinearGradientEndPoint={{ x: frameX + frameW, y: frameY + frameH }}
					fillLinearGradientColorStops={
						frameColor.gradientFrom && frameColor.gradientTo
							? [0, frameColor.gradientFrom, 1, frameColor.gradientTo]
							: undefined
					}
				/>

				<Group x={cardPadding + innerPadding} y={cardPadding + innerPadding}>
					{imgs.map((img, index) => {
						const x = 0
						const y = index * (photoHeight + spacing)
						if (!img) {
							return (
								<Rect
									key={index}
									x={x}
									y={y}
									width={photoWidth}
									height={photoHeight}
									fill="#eee"
								/>
							)
						}

						// object-cover crop math (same as export)
						const srcW = img.width
						const srcH = img.height
						const srcAspect = srcW / srcH
						const destAspect = photoWidth / photoHeight
						let sx = 0
						let sy = 0
						let sw = srcW
						let sh = srcH
						if (srcAspect > destAspect) {
							sw = Math.round(srcH * destAspect)
							sx = Math.round((srcW - sw) / 2)
						} else if (srcAspect < destAspect) {
							sh = Math.round(srcW / destAspect)
							sy = Math.round((srcH - sh) / 2)
						}

						return (
							<KonvaImage
								key={index}
								image={img}
								x={x}
								y={y}
								width={photoWidth}
								height={photoHeight}
								crop={{ x: sx, y: sy, width: sw, height: sh }}
							/>
						)
					})}
				</Group>

				{/* Footer strip (same color) */}
				<Rect
					x={0}
					y={height - footerHeight}
					width={outerWidth}
					height={footerHeight}
					fill={frameColor.color}
				/>
			</Layer>
		</Stage>
	)
}


