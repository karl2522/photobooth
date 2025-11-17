import { ImageResponse } from 'next/og'
import React from 'react'

export const contentType = 'image/png'

export async function GET() {
	return new ImageResponse(
		(
			<div
				style={{
					width: 32,
					height: 32,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)',
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
						fontSize: 16,
						lineHeight: 1,
					}}
				>
					♡
				</div>
			</div>
		),
		{
			width: 32,
			height: 32,
		}
	)
}


