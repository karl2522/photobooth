'use client'

import { useState } from 'react'
import { Camera, Sparkles, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PhotoBooth from '@/components/photobooth'
import FallingText from '@/components/FallingText'

export default function Home() {
    const [showPhotobooth, setShowPhotobooth] = useState(false)

    if (showPhotobooth) {
        return <PhotoBooth onBack={() => setShowPhotobooth(false)} />
    }

    return (
        <main className="relative h-screen max-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating blobs */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl animate-pulse-glow" />
                <div className="absolute bottom-32 right-20 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }} />

                {/* Photo strip decoration - left side */}
                <div className="absolute left-8 top-1/4 animate-slide-diagonal animate-wiggle hidden lg:block">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-2xl shadow-pink-200/50 rotate-[-12deg] border-2 border-pink-200">
                        <div className="flex flex-col gap-2">
                            <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-rose-200 rounded-xl" />
                            <div className="w-24 h-24 bg-gradient-to-br from-rose-200 to-pink-300 rounded-xl" />
                            <div className="w-24 h-24 bg-gradient-to-br from-pink-300 to-rose-300 rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Photo strip decoration - right side */}
                <div className="absolute right-12 top-1/3 animate-float animate-pop hidden lg:block" style={{ animationDelay: '2s' }}>
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-2xl shadow-rose-200/50 rotate-[8deg] border-2 border-rose-200">
                        <div className="flex flex-col gap-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-rose-200 to-pink-200 rounded-xl" />
                            <div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-rose-200 rounded-xl" />
                            <div className="w-20 h-20 bg-gradient-to-br from-rose-300 to-pink-300 rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Small photo strip - mobile visible */}
                <div className="absolute right-6 bottom-32 animate-float-delayed lg:hidden">
                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-xl shadow-pink-200/40 rotate-[15deg] border border-pink-200">
                        <div className="flex flex-col gap-1.5">
                            <div className="w-14 h-14 bg-gradient-to-br from-pink-200 to-rose-200 rounded-lg" />
                            <div className="w-14 h-14 bg-gradient-to-br from-rose-200 to-pink-300 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Floating sparkles */}
                <Sparkles className="absolute top-1/4 left-1/3 w-8 h-8 text-pink-400 animate-pulse hidden md:block" />
                <Sparkles className="absolute bottom-1/3 right-1/4 w-6 h-6 text-rose-400 animate-pulse" style={{ animationDelay: '1s' }} />
                <Heart className="absolute top-1/2 left-1/4 w-7 h-7 text-pink-300 animate-pulse hidden md:block" style={{ animationDelay: '2s' }} />
            </div>

            {/* Soft falling love text - subtle and sparse */}
            <FallingText />

            {/* Main content - centered and responsive */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center space-y-6 sm:space-y-8 max-w-2xl mx-auto">
                    {/* Title */}
                    <div className="space-y-3 sm:space-y-4 animate-float-up">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-balance leading-tight">
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
                Theresa's
              </span>
                        </h1>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-balance leading-tight bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                            Photobooth
                        </h2>
                        <div className="flex items-center justify-center gap-2">
                            <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500 fill-pink-500 animate-pulse" />
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        </div>
                    </div>

                    {/* Subtitle + CTA animate together once (same style as title) */}
                    <div className="space-y-3 sm:space-y-4 animate-float-up">
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-balance max-w-md mx-auto px-4">
                            made especially for Theresa
                        </p>
                        <div className="pt-4 sm:pt-6">
                            <Button
                                onClick={() => setShowPhotobooth(true)}
                                size="lg"
                                className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white shadow-2xl shadow-pink-300/60 transition-all duration-300 hover:scale-110 active:scale-95 rounded-full px-8 sm:px-12 py-6 sm:py-7 text-base sm:text-lg md:text-xl font-semibold animate-glow-pulse group"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                                <Camera className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="relative z-10">Open Photobooth</span>
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 ml-2 relative z-10 group-hover:scale-125 transition-transform duration-300" />
                            </Button>
                        </div>
                    </div>

					
                </div>
            </div>
			
			{/* Panning ribbon below hero */}
			<div className="absolute bottom-6 left-0 right-0 z-20 px-4">
				<div className="marquee marquee-paused rounded-full bg-white/80 backdrop-blur-sm border border-pink-200/70 shadow-lg mx-auto max-w-5xl">
					<div className="marquee-track">
						{/* segment 1 */}
						<div className="marquee-segment py-3 sm:py-4">
							<Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 fill-pink-500" />
							<span className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">theresa gwapa</span>
							<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
							<span className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">theresa gwapa</span>
							<Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 fill-pink-500" />
							<span className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">theresa gwapa</span>
							<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
							<span className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">theresa gwapa</span>
							<Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 fill-pink-500" />
							<span className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">theresa gwapa</span>
							<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
							<span className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">theresa gwapa</span>
						</div>
						{/* segment 2 (duplicate for seamless loop) */}
						<div className="marquee-segment py-3 sm:py-4">
							<Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 fill-pink-500" />
							<span className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">theresa gwapa</span>
							<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
							<span className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">theresa gwapa</span>
							<Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 fill-pink-500" />
							<span className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">theresa gwapa</span>
							<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
							<span className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">theresa gwapa</span>
							<Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 fill-pink-500" />
							<span className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">theresa gwapa</span>
							<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
							<span className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">theresa gwapa</span>
						</div>
					</div>
				</div>
			</div>
			
			{/* Additional photobooth-themed decorations */}
			<div className="absolute inset-0 pointer-events-none">
				{/* Soft beams */}
				<div className="beam" />
				<div className="beam beam--slow" style={{ top: '20%' }} />
				<div className="beam beam--reverse" style={{ top: '65%' }} />
				{/* Film edges */}
				<div className="film-edge film-edge--top" />
				<div className="film-edge film-edge--bottom" />
				{/* Confetti/stickers scattered */}
				<span className="sticker sticker--pink" style={{ top: '12%', left: '8%', animationDelay: '0s' }} />
				<span className="sticker sticker--rose" style={{ top: '28%', left: '18%', animationDelay: '0.6s' }} />
				<span className="sticker sticker--light" style={{ top: '42%', left: '6%', animationDelay: '1s' }} />
				<span className="sticker sticker--pink" style={{ top: '18%', right: '10%', animationDelay: '0.3s' }} />
				<span className="sticker sticker--rose" style={{ bottom: '22%', right: '16%', animationDelay: '0.9s' }} />
				<span className="sticker sticker--light" style={{ bottom: '30%', left: '22%', animationDelay: '1.2s' }} />
			</div>
        </main>
    )
}
