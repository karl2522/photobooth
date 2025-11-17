'use client'

import { useState } from 'react'
import { Camera, Sparkles, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PhotoBooth from '@/components/photobooth'

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

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-balance max-w-md mx-auto px-4 animate-float-up" style={{ animationDelay: '0.2s' }}>
                        capture your moment, cherish forever
                    </p>

                    {/* CTA Button */}
                    <div className="pt-4 sm:pt-6 animate-float-up" style={{ animationDelay: '0.4s' }}>
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

                    {/* Feature badges */}
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
                        <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-pink-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 animate-float-up" style={{ animationDelay: '0.5s' }}>
                            <p className="text-xs sm:text-sm text-pink-600 font-medium">instant capture</p>
                        </div>
                        <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-rose-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 animate-float-up" style={{ animationDelay: '0.6s' }}>
                            <p className="text-xs sm:text-sm text-rose-600 font-medium">download photos</p>
                        </div>
                        <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-pink-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 hidden sm:block animate-float-up" style={{ animationDelay: '0.7s' }}>
                            <p className="text-xs sm:text-sm text-pink-600 font-medium">made with love</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
