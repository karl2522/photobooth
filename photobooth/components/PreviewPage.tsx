	'use client'

	import DecorBackground from '@/components/DecorBackground'
import KonvaPreview from '@/components/KonvaPreview'
import SectionCard from '@/components/SectionCard'
import { getDecorLayout } from '@/components/decorLayout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft, Download, RotateCcw, Smile, Sparkles } from 'lucide-react'
import * as React from 'react'

	type FrameColor = { id: string; name: string; color: string; border: string; gradientFrom?: string; gradientTo?: string }
	type Sticker = { id: string; name: string }

	type PreviewPageProps = {
		onBack?: () => void
		capturedImages: string[]
		selectedFrameColor: string
		setSelectedFrameColor: (value: string) => void
		selectedSticker: string
		setSelectedSticker: (value: string) => void
		downloadPhotoStrip: () => void
		retakePhotos: () => void
		frameColors: FrameColor[]
		stickers: Sticker[]
	}

	export default function PreviewPage(props: PreviewPageProps) {
		const {
			onBack,
			capturedImages,
			selectedFrameColor,
			setSelectedFrameColor,
			selectedSticker,
			setSelectedSticker,
			downloadPhotoStrip,
			retakePhotos,
			frameColors,
			stickers,
		} = props

		return (
			<div className="relative h-screen max-h-screen overflow-hidden bg-gradient-to-br from-pink-50/80 via-rose-50/50 to-pink-100/60">
				<DecorBackground showIcons={false} />

				{/* Decorative photo strips - match landing style, stay behind content */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{/* Film edges top/bottom */}
					<div className="film-edge film-edge--top" />
					<div className="film-edge film-edge--bottom" />
					{/* Left strip */}
					<div className="absolute left-8 top-1/4 animate-slide-diagonal animate-wiggle hidden lg:block">
						<div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-2xl shadow-pink-200/50 rotate-[-12deg] border-2 border-pink-200">
							<div className="flex flex-col gap-2">
								<div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-rose-200 rounded-xl" />
								<div className="w-24 h-24 bg-gradient-to-br from-rose-200 to-pink-300 rounded-xl" />
								<div className="w-24 h-24 bg-gradient-to-br from-pink-300 to-rose-300 rounded-xl" />
							</div>
						</div>
					</div>
					{/* Right strip */}
					<div className="absolute right-12 top-1/3 animate-float animate-pop hidden lg:block" style={{ animationDelay: '1.2s' }}>
						<div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-2xl shadow-rose-200/50 rotate-[8deg] border-2 border-rose-200">
							<div className="flex flex-col gap-2">
								<div className="w-20 h-20 bg-gradient-to-br from-rose-200 to-pink-200 rounded-xl" />
								<div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-rose-200 rounded-xl" />
								<div className="w-20 h-20 bg-gradient-to-br from-rose-300 to-pink-300 rounded-xl" />
							</div>
						</div>
					</div>
					{/* Corner stickers and mini frames */}
					<span className="sticker sticker--pink" style={{ top: '12%', left: '6%', animationDelay: '0s' }} />
					<span className="sticker sticker--rose" style={{ top: '22%', left: '14%', animationDelay: '0.5s' }} />
					<span className="sticker sticker--light" style={{ top: '16%', right: '10%', animationDelay: '0.3s' }} />
					<span className="sticker sticker--pink" style={{ bottom: '18%', right: '8%', animationDelay: '0.8s' }} />
					<span className="sticker sticker--rose" style={{ bottom: '26%', left: '10%', animationDelay: '1.1s' }} />
					{/* Mini frames clusters */}
					<div className="absolute left-6 bottom-16 hidden md:flex items-center gap-3">
						<span className="mini-frame" />
						<span className="mini-frame mini-frame--light" />
						<span className="mini-frame" />
					</div>
					<div className="absolute right-8 top-14 hidden md:flex items-center gap-3">
						<span className="mini-frame mini-frame--light" />
						<span className="mini-frame" />
					</div>
					
				</div>
				{onBack && (
					<button
						onClick={onBack}
						className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-pink-200 shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
					>
						<ArrowLeft className="w-4 h-4 text-pink-600" />
						<span className="text-sm font-medium text-pink-600">Back</span>
					</button>
				)}

				<div className="relative z-10 h-full flex flex-col items-center justify-center gap-4 p-4 md:p-6">
					<div className="text-center animate-bounce-in">
						<h1 className="text-3xl md:text-4xl font-bold text-balance mb-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
							customize your strip ♡
						</h1>
						<p className="text-muted-foreground text-sm md:text-base">
							choose a frame color and add decorations
						</p>
					</div>

					<div className="w-full max-w-5xl flex-1 min-h-0">
						<div className="p-2 md:p-3 animate-float-up w-fit mx-auto">
							<div className="grid grid-cols-1 md:grid-cols-[250px_22rem] gap-6">
								{/* Strip preview (left) */}
								<div className="flex items-start justify-start min-h-0">
									{/* Scroll container: show up to ~4 photos, rest scroll; scrollbar hidden */}
									<div className="relative w-[250px] max-h-[60vh] md:max-h-[68vh] lg:max-h-[72vh] overflow-y-auto scrollbar-hide overscroll-contain">
										<div className="relative">
											<KonvaPreview
												images={capturedImages}
												frameColor={frameColors.find(f => f.id === selectedFrameColor)!}
												width={250}
											/>
											{selectedSticker !== 'none' && (
												<div className="pointer-events-none absolute inset-0">
													{(() => {
													const Icon = ({ kind, index }: { kind: string; index: number }) => {
															// choose variant based on index cycling 1..3 for hearts/flowers
															const pick = (prefix: string) => {
																const variant = (index % 3) + 1
																return `/${prefix}${variant}.svg`
															}
															let src = ''
															if (kind === 'hearts') src = pick('heart')
															else if (kind === 'flowers') src = pick('flower')
															else if (kind === 'bows') src = '/bow.svg'
															else if (kind === 'butterflies') src = '/butterfly.svg'
															else if (kind === 'ribbons') src = '/ribbon.svg'
															else if (kind === 'pearls') src = '/pearl.svg'
															return <img src={src} alt={kind} className="w-full h-full object-contain" />
														}
														const nodes: React.ReactNode[] = []
														const bandOuter = 12 // matches cardPadding in export
														const bandInner = 12 // matches innerPadding in export
														const centerOffset = bandOuter + bandInner / 2 // distance from edge to band center
														const baseSize = bandOuter + bandInner // fill band thickness (≈24px)
														const layout = getDecorLayout(selectedSticker)
														layout.forEach((pt, i) => {
															const size = Math.min(baseSize, baseSize * pt.sizeScale)
															const style: React.CSSProperties = {
																width: size,
																height: size,
																transform: `rotate(${pt.rotationDeg}deg)`,
															}
															if (pt.edge === 'top') {
																style.top = centerOffset - size / 2
																style.left = `${pt.percent}%`
															} else if (pt.edge === 'bottom') {
																style.bottom = centerOffset - size / 2
																style.left = `${pt.percent}%`
															} else if (pt.edge === 'left') {
																style.left = centerOffset - size / 2
																style.top = `${pt.percent}%`
															} else {
																style.right = centerOffset - size / 2
																style.top = `${pt.percent}%`
															}
															let src = '/pearl.svg'
															if (selectedSticker === 'hearts') {
																const arr = ['heart1','heart2','heart3']
																src = `/${arr[i % arr.length]}.svg`
															} else if (selectedSticker === 'flowers') {
																const arr = ['flower1','flower2','flower3']
																src = `/${arr[i % arr.length]}.svg`
															} else if (selectedSticker === 'bows') {
																src = '/bow.svg'
															} else if (selectedSticker === 'butterflies') {
																src = '/butterfly.svg'
															} else if (selectedSticker === 'ribbons') {
																src = '/ribbon.svg'
															}
															nodes.push(
																<img
																	key={`d-${i}`}
																	src={src}
																	alt={selectedSticker}
																	className="absolute select-none pointer-events-none"
																	style={style}
																/>
															)
														})
														return <>{nodes}</>
													})()}
												</div>
											)}
										</div>
									</div>
								</div>

								{/* Controls (right) */}
								<div className="md:border-l md:border-pink-200/40 md:pl-3 space-y-4">
									<div>
										<h3 className="text-sm font-semibold text-pink-600 mb-3 flex items-center gap-2">
											<Smile className="w-4 h-4" />
											Frame Color
										</h3>
										<div className="grid grid-cols-5 gap-3 max-w-full">
											{frameColors.map((frameColor) => (
												<button
													key={frameColor.id}
													onClick={() => setSelectedFrameColor(frameColor.id)}
													className={cn(
														'rounded-lg border-2 transition-all duration-300 hover:scale-110 active:scale-95 w-8 h-8 md:w-9 md:h-9',
														selectedFrameColor === frameColor.id
															? 'border-pink-500 ring-2 ring-pink-200'
															: 'border-gray-300 hover:border-pink-300'
													)}
													style={{ backgroundColor: frameColor.color, borderColor: frameColor.border }}
													title={frameColor.name}
												/>
											))}
										</div>
									</div>

									<SectionCard className="p-3">
										<h3 className="text-sm font-semibold text-pink-600 mb-3 flex items-center gap-2">
											<Sparkles className="w-4 h-4" />
											Decorations
										</h3>
										<div className="grid grid-cols-3 gap-2 max-w-[320px]">
											{stickers.map((sticker) => (
												<button
													key={sticker.id}
													onClick={() => setSelectedSticker(sticker.id)}
													className={cn(
														'aspect-square rounded-xl border-2 transition-all duration-300 hover:scale-110 active:scale-95 flex flex-col items-center justify-center gap-1 w-14 h-14',
														selectedSticker === sticker.id
															? 'border-pink-500 bg-pink-50 ring-4 ring-pink-200'
															: 'border-pink-200 bg-white hover:bg-pink-50 hover:border-pink-300'
													)}
												>
													<span className="text-[10px] font-semibold text-pink-600">{sticker.name}</span>
												</button>
											))}
										</div>
										<p className="mt-2 text-xs text-pink-500/80 italic">more coming soon (kiss sa)</p>
									</SectionCard>

									<div className="space-y-3">
										<Button
											onClick={downloadPhotoStrip}
											size="lg"
											className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-300/50 transition-all duration-300 hover:scale-105 active:scale-95 rounded-full text-base group animate-glow-pulse"
										>
											<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
											<Download className="w-5 h-5 mr-2 relative z-10 group-hover:scale-110 transition-transform" />
											<span className="relative z-10">Download Strip</span>
										</Button>
										<Button
											onClick={retakePhotos}
											variant="outline"
											size="lg"
											className="w-full border-pink-300 hover:bg-pink-50 rounded-full text-base hover:scale-105 active:scale-95 transition-all duration-300"
										>
											<RotateCcw className="w-5 h-5 mr-2" />
											Retake Photos
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
