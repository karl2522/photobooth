'use client'

import * as React from 'react'
import { ArrowLeft, Download, RotateCcw, Smile, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import DecorBackground from '@/components/DecorBackground'
import SectionCard from '@/components/SectionCard'

type FrameColor = { id: string; name: string; color: string; border: string }
type Sticker = { id: string; name: string; emoji: string }

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
						<div className="grid grid-cols-1 md:grid-cols-[220px_20rem] gap-3">
							{/* Strip preview (left) */}
							<div className="flex items-start justify-start min-h-0">
								<div className="relative w-[220px]">
									<div
										className="relative p-3 shadow"
										style={{ backgroundColor: frameColors.find(f => f.id === selectedFrameColor)?.color }}
									>
										<div className="space-y-2">
											{capturedImages.map((image, index) => (
												<div
													key={index}
													className="relative w-full aspect-[4/3] overflow-hidden shadow animate-in zoom-in-95 duration-500"
													style={{ animationDelay: `${index * 0.1}s` }}
												>
													<img
														src={image || "/placeholder.svg"}
														alt={`Photo ${index + 1}`}
														className="w-full h-full object-cover"
													/>
													{selectedSticker !== 'none' && stickers.find(s => s.id === selectedSticker)?.emoji && (
														<>
															<div className="absolute top-1.5 left-1.5 text-xl animate-bounce-in">
																{stickers.find(s => s.id === selectedSticker)?.emoji}
															</div>
															<div className="absolute top-1.5 right-1.5 text-xl animate-bounce-in" style={{ animationDelay: '0.1s' }}>
																{stickers.find(s => s.id === selectedSticker)?.emoji}
															</div>
															<div className="absolute bottom-1.5 left-1.5 text-xl animate-bounce-in" style={{ animationDelay: '0.2s' }}>
																{stickers.find(s => s.id === selectedSticker)?.emoji}
															</div>
															<div className="absolute bottom-1.5 right-1.5 text-xl animate-bounce-in" style={{ animationDelay: '0.3s' }}>
																{stickers.find(s => s.id === selectedSticker)?.emoji}
															</div>
														</>
													)}
												</div>
											))}
										</div>
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
									<div className="grid grid-cols-5 gap-2">
										{frameColors.map((frameColor) => (
											<button
												key={frameColor.id}
												onClick={() => setSelectedFrameColor(frameColor.id)}
												className={cn(
													"aspect-square rounded-xl border-2 transition-all duration-300 hover:scale-110 active:scale-95",
													selectedFrameColor === frameColor.id
														? "border-pink-500 ring-4 ring-pink-200"
														: "border-gray-300 hover:border-pink-300"
												)}
												style={{ backgroundColor: frameColor.color }}
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
									<div className="grid grid-cols-3 gap-2">
										{stickers.map((sticker) => (
											<button
												key={sticker.id}
												onClick={() => setSelectedSticker(sticker.id)}
												className={cn(
													"aspect-square rounded-xl border-2 transition-all duration-300 hover:scale-110 active:scale-95 flex flex-col items-center justify-center gap-1",
													selectedSticker === sticker.id
														? "border-pink-500 bg-pink-50 ring-4 ring-pink-200"
														: "border-pink-200 bg-white hover:bg-pink-50 hover:border-pink-300"
												)}
											>
												<span className="text-2xl">{sticker.emoji || '—'}</span>
												<span className="text-[10px] font-medium text-pink-600">{sticker.name}</span>
											</button>
										))}
									</div>
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


