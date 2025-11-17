import { ImageResponse } from 'next/og'

export const size = {
	width: 32,
	height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
	return new ImageResponse(
		(
			// Gradient pink tile with a small camera heart glyph
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background:
						'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)',
					borderRadius: 8,
				}}
			>
				<div
					style={{
						width: 22,
						height: 22,
						borderRadius: 6,
						background: 'rgba(255,255,255,0.9)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div
						style={{
							fontSize: 16,
							lineHeight: 1,
						}}
					>
						♡
					</div>
				</div>
			</div>
		),
		{
			...size,
		}
	)
}


