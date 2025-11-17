'use client'

import * as React from 'react'
import { Camera, Sparkles, ArrowLeft, ArrowRight, Heart, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import DecorBackground from '@/components/DecorBackground'
import SectionCard from '@/components/SectionCard'

type Filter = { id: string; name: string; class: string }

type CameraPageProps = {
	onBack?: () => void
	videoRef: React.RefObject<HTMLVideoElement>
	canvasRef: React.RefObject<HTMLCanvasElement>
	isCameraReady: boolean
	isLoading: boolean
	isCapturing: boolean
	countdown: number | null
	currentPhotoIndex: number
	photoCount: number
	setPhotoCount: (value: number) => void
	countdownDelay: number
	setCountdownDelay: (value: number) => void
	selectedFilter: string
	setSelectedFilter: (value: string) => void
	startCamera: () => void
	startPhotoSequence: () => void
	capturedImages: string[]
	hasCompletedStrip: boolean
	goToPreview: () => void
	filters: Filter[]
	photoCounts: number[]
	countdownOptions: number[]
}

export default function CameraPage(props: CameraPageProps) {
	const {
		onBack,
		videoRef,
		canvasRef,
		isCameraReady,
		isLoading,
		isCapturing,
		countdown,
		currentPhotoIndex,
		photoCount,
		setPhotoCount,
		countdownDelay,
		setCountdownDelay,
		selectedFilter,
		setSelectedFilter,
		startCamera,
		startPhotoSequence,
		capturedImages,
		hasCompletedStrip,
		goToPreview,
		filters,
		photoCounts,
		countdownOptions,
	} = props

	return (
		<div className="relative h-screen max-h-screen overflow-hidden bg-gradient-to-br from-pink-50/80 via-rose-50/50 to-pink-100/60">
			{onBack && (
				<button
					onClick={onBack}
					className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-pink-200 shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce-in"
				>
					<ArrowLeft className="w-4 h-4 text-pink-600" />
					<span className="text-sm font-medium text-pink-600">Back</span>
				</button>
			)}

			<DecorBackground />

			<div className="relative z-10 h-full flex flex-col items-center justify-center gap-3 p-4 md:p-6">
				<div className="text-center animate-bounce-in">
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
						photobooth ♡
					</h1>
					<p className="text-muted-foreground text-sm md:text-base">
						capture your moment, cherish forever
					</p>
				</div>

				{isCameraReady && (
					<div className="w-full max-w-3xl flex gap-3 justify-center">
						{/* Photos dropdown */}
						<SectionCard className="relative animate-float-up">
							<select
								value={photoCount}
								onChange={(e) => setPhotoCount(Number(e.target.value))}
								disabled={isCapturing || capturedImages.length > 0}
								className="peer block w-40 appearance-none bg-white/0 text-pink-700 font-semibold text-sm rounded-2xl py-2 pl-3 pr-9 focus:outline-none focus:ring-2 focus:ring-pink-300/70 focus:border-pink-300 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
								title="Select number of photos"
							>
								{photoCounts.map((count) => (
									<option key={count} value={count}>
										{count} Photos
									</option>
								))}
							</select>
							<ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500 transition-transform duration-200 peer-focus:rotate-180" />
						</SectionCard>

						{/* Delay dropdown */}
						<SectionCard className="relative animate-float-up">
							<select
								value={countdownDelay}
								onChange={(e) => setCountdownDelay(Number(e.target.value))}
								disabled={isCapturing}
								className="peer block w-40 appearance-none bg-white/0 text-pink-700 font-semibold text-sm rounded-2xl py-2 pl-3 pr-9 focus:outline-none focus:ring-2 focus:ring-pink-300/70 focus:border-pink-300 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
								title="Select countdown delay"
							>
								{countdownOptions.map((delay) => (
									<option key={delay} value={delay}>
										{delay}s Delay
									</option>
								))}
							</select>
							<ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500 transition-transform duration-200 peer-focus:rotate-180" />
						</SectionCard>
					</div>
				)}

				<div className="w-full max-w-3xl flex-1 min-h-0 flex items-center justify-center">
					<div className="relative w-full max-h-[45vh] md:max-h-[50vh] aspect-video">
						{/* Gradient border wrapper for camera view */}
						<div className="p-[1.5px] rounded-3xl bg-gradient-to-br from-pink-300/60 to-rose-300/60 shadow-2xl shadow-pink-200/50">
							<div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-pink-100/50 h-full flex flex-col animate-float-up">
							{countdown !== null && (
								<div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
									<span
										key={countdown}
										className="relative text-white text-[80px] md:text-[120px] font-extrabold drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] animate-in fade-in-0 zoom-in-95 duration-700 will-change-transform"
									>
										{countdown}
									</span>
									<span
										key={`ghost-${countdown}`}
										className="absolute text-white/40 text-[80px] md:text-[120px] font-extrabold animate-ping"
									>
										{countdown}
									</span>
								</div>
							)}

							<div className="relative flex-1 w-full overflow-hidden rounded-2xl bg-muted min-h-0">
								{!isCameraReady && (
									<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100">
										<div className="text-center space-y-4">
											<Camera className="w-16 h-16 md:w-20 md:h-20 mx-auto text-pink-400 animate-bounce" />
											<p className="text-base md:text-lg text-muted-foreground font-medium">
												{isLoading ? 'Starting camera...' : 'Camera not active'}
											</p>
										</div>
									</div>
								)}
								<video
									ref={videoRef}
									autoPlay
									playsInline
									muted
									className={cn(
										"w-full h-full object-cover transition-all duration-300",
										isCameraReady ? "opacity-100" : "opacity-0",
										filters.find(f => f.id === selectedFilter)?.class
									)}
								/>
							</div>

							<Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-pink-400 animate-pulse animate-pop" />
							<Sparkles className="absolute -bottom-3 -left-3 w-7 h-7 text-rose-400 animate-pulse animate-pop" style={{ animationDelay: '0.5s' }} />
							</div>
						</div>

						<canvas ref={canvasRef} className="hidden" />
					</div>
				</div>

				{isCameraReady && (
					<div className="w-full max-w-3xl">
						<div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-pink-100/50 shadow-lg animate-float-up">
							<div className="flex items-center gap-2 mb-3">
								<Sparkles className="w-4 h-4 text-pink-400" />
								<h3 className="text-sm font-semibold text-pink-600">Filters</h3>
							</div>
							<div className="flex gap-2 md:gap-3 overflow-x-auto pb-1 scrollbar-hide">
								{filters.map((filter) => (
									<button
										key={filter.id}
										onClick={() => setSelectedFilter(filter.id)}
										disabled={isCapturing}
										className={cn(
											"flex-shrink-0 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50",
											selectedFilter === filter.id
												? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-300/50"
												: "bg-pink-50 text-pink-600 hover:bg-pink-100"
										)}
									>
										{filter.name}
									</button>
								))}
							</div>
						</div>
					</div>
				)}

				{isCameraReady && (
					<div className="w-full max-w-3xl space-y-3">
						<div className="flex flex-wrap items-center justify-center gap-3">
							{capturedImages.length === 0 ? (
								<Button
									onClick={startPhotoSequence}
									disabled={isCapturing}
									size="lg"
									className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-300/50 transition-all duration-300 hover:scale-110 active:scale-95 rounded-full px-8 md:px-12 text-base md:text-lg group animate-glow-pulse disabled:opacity-50"
								>
									<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
									<Camera className="w-5 h-5 md:w-6 md:h-6 mr-2 relative z-10 group-hover:rotate-12 transition-transform" />
									<span className="relative z-10">{isCapturing ? 'Capturing...' : `Take ${photoCount} Photos`}</span>
								</Button>
							) : hasCompletedStrip ? (
								<Button
									onClick={goToPreview}
									size="lg"
									className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-300/50 transition-all duration-300 hover:scale-110 active:scale-95 rounded-full px-8 md:px-12 text-base md:text-lg group animate-glow-pulse"
								>
									<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
									<span className="relative z-10">Next</span>
									<ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
								</Button>
							) : (
								<Button
									disabled
									size="lg"
									className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-300/50 rounded-full px-8 md:px-12 text-base md:text-lg disabled:opacity-70"
								>
									<Camera className="w-5 h-5 md:w-6 md:h-6 mr-2" />
									<span>Capturing...</span>
								</Button>
							)}
						</div>
						{/* progress text removed per request */}
					</div>
				)}

				{!isCameraReady && (
					<Button
						onClick={startCamera}
						disabled={isLoading}
						size="lg"
						className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-300/50 transition-all duration-300 hover:scale-110 active:scale-95 rounded-full px-8 md:px-12 text-base md:text-lg group"
					>
						<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
						<Camera className="w-5 h-5 md:w-6 md:h-6 mr-2 relative z-10 group-hover:rotate-12 transition-transform" />
						<span className="relative z-10">{isLoading ? 'Starting...' : 'Start Camera'}</span>
					</Button>
				)}
			</div>
		</div>
	)
}


