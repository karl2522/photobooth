'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import CameraPage from '@/components/CameraPage'
import PreviewPage from '@/components/PreviewPage'

const FILTERS = [
    { id: 'none', name: 'Original', class: '' },
    { id: 'sepia', name: 'Vintage', class: 'sepia-[0.8] contrast-[1.1]' },
    { id: 'grayscale', name: 'B&W', class: 'grayscale contrast-[1.2]' },
    { id: 'saturate', name: 'Pop', class: 'saturate-[1.5] contrast-[1.1]' },
    { id: 'hue', name: 'Dreamy', class: 'hue-rotate-[320deg] saturate-[1.2]' },
    { id: 'warm', name: 'Warm', class: 'sepia-[0.3] saturate-[1.3] brightness-[1.05]' },
]

const PHOTO_COUNTS = [2, 4, 6]
const COUNTDOWN_OPTIONS = [3, 5, 10]

const FRAME_COLORS = [
    { id: 'white', name: 'White', color: '#ffffff', border: '#e5e7eb' },
    { id: 'pink', name: 'Pink', color: '#fce7f3', border: '#f9a8d4' },
    { id: 'lavender', name: 'Lavender', color: '#f3e8ff', border: '#d8b4fe' },
    { id: 'blue', name: 'Blue', color: '#dbeafe', border: '#93c5fd' },
    { id: 'mint', name: 'Mint', color: '#d1fae5', border: '#6ee7b7' },
]

const STICKERS = [
    { id: 'none', name: 'None', emoji: '' },
    { id: 'hearts', name: 'Hearts', emoji: '💗' },
    { id: 'stars', name: 'Stars', emoji: '⭐' },
    { id: 'sparkles', name: 'Sparkles', emoji: '✨' },
    { id: 'flowers', name: 'Flowers', emoji: '🌸' },
    { id: 'butterflies', name: 'Butterfly', emoji: '🦋' },
]

export default function PhotoBooth({ onBack }: { onBack?: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [capturedImages, setCapturedImages] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isCameraReady, setIsCameraReady] = useState(false)
    const [countdown, setCountdown] = useState<number | null>(null)
    const [selectedFilter, setSelectedFilter] = useState('none')
    const [photoCount, setPhotoCount] = useState(4)
    const [countdownDelay, setCountdownDelay] = useState(3)
    const [isCapturing, setIsCapturing] = useState(false)
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

    const [view, setView] = useState<'capture' | 'preview'>('capture')

    const [selectedFrameColor, setSelectedFrameColor] = useState('white')
    const [selectedSticker, setSelectedSticker] = useState('none')

    const startCamera = useCallback(async () => {
        setIsLoading(true)
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: false,
            })

            setStream(mediaStream)

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
                await videoRef.current.play()
                setIsCameraReady(true)
            }
        } catch (error) {
            console.error('[v0] Camera access error:', error)
            alert('Unable to access camera. Please make sure you have granted camera permissions.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
            setIsCameraReady(false)
        }
    }, [stream])

    const captureSinglePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || !isCameraReady) return null

        const video = videoRef.current
        const canvas = canvasRef.current

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const context = canvas.getContext('2d')
        if (context) {
            const filter = FILTERS.find(f => f.id === selectedFilter)
            if (filter?.id === 'sepia') {
                context.filter = 'sepia(0.8) contrast(1.1)'
            } else if (filter?.id === 'grayscale') {
                context.filter = 'grayscale(1) contrast(1.2)'
            } else if (filter?.id === 'saturate') {
                context.filter = 'saturate(1.5) contrast(1.1)'
            } else if (filter?.id === 'hue') {
                context.filter = 'hue-rotate(320deg) saturate(1.2)'
            } else if (filter?.id === 'warm') {
                context.filter = 'sepia(0.3) saturate(1.3) brightness(1.05)'
            }

            context.drawImage(video, 0, 0, canvas.width, canvas.height)
            return canvas.toDataURL('image/png')
        }
        return null
    }, [isCameraReady, selectedFilter])

    const startPhotoSequence = useCallback(async () => {
        if (!isCameraReady || isCapturing) return

        setIsCapturing(true)
        setCapturedImages([])
        setCurrentPhotoIndex(0)

        const captureWithCountdown = async (photoIndex: number): Promise<string | null> => {
            return new Promise((resolve) => {
                let count = countdownDelay
                setCountdown(count)
                setCurrentPhotoIndex(photoIndex)

                const countdownInterval = setInterval(() => {
                    count -= 1
                    if (count > 0) {
                        setCountdown(count)
                    } else {
                        clearInterval(countdownInterval)
                        setCountdown(null)

                        const imageData = captureSinglePhoto()
                        resolve(imageData)

                        setTimeout(() => {}, 500)
                    }
                }, 1000)
            })
        }

        const newImages: string[] = []

        for (let i = 0; i < photoCount; i++) {
            const image = await captureWithCountdown(i + 1)
            if (image) {
                newImages.push(image)
                setCapturedImages([...newImages])
            }
        }

        setIsCapturing(false)
        setCurrentPhotoIndex(0)
    }, [isCameraReady, isCapturing, photoCount, countdownDelay, captureSinglePhoto])

    const downloadPhotoStrip = useCallback(() => {
        if (capturedImages.length === 0) return

        const stripCanvas = document.createElement('canvas')
        const ctx = stripCanvas.getContext('2d')
        if (!ctx) return

        // Export at a larger size while keeping the same proportions as the preview.
        // Base preview outer width is 220px. Scale all paddings/spacing/fonts from that.
        const baseOuterWidth = 220
        const exportOuterWidth = 600 // make the downloadable strip larger
        const scale = exportOuterWidth / baseOuterWidth

        const outerWidth = exportOuterWidth
        const cardPadding = Math.round(12 * scale)
        const innerPadding = 0
        const contentWidth = outerWidth - 2 * (cardPadding + innerPadding)
        const photoWidth = contentWidth
        const photoHeight = Math.round(contentWidth * 3 / 4) // 4:3 tiles
        const spacing = Math.round(8 * scale)
        const footerHeight = Math.round(28 * scale)

        stripCanvas.width = outerWidth
        stripCanvas.height =
            (cardPadding * 2) +
            (innerPadding * 2) +
            (photoHeight * capturedImages.length) +
            (spacing * (capturedImages.length - 1)) +
            footerHeight

        // Determine frame color first
        const frameColor = FRAME_COLORS.find(f => f.id === selectedFrameColor) || FRAME_COLORS[0]

        // Background should be the frame color so all borders (top/sides/between) are colored
        ctx.fillStyle = frameColor.color
        ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height)

        // Inner colored frame background
        const frameX = cardPadding
        const frameY = cardPadding
        const frameW = outerWidth - cardPadding * 2
        const frameH =
            (innerPadding * 2) +
            (photoHeight * capturedImages.length) +
            (spacing * (capturedImages.length - 1))
        ctx.fillStyle = frameColor.color
        ctx.fillRect(frameX, frameY, frameW, frameH)

        // Load images
        const images = capturedImages.map(src => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = src
            return img
        })

        let loadedCount = 0
        images.forEach((img, index) => {
            img.onload = () => {
                loadedCount++
                const x = cardPadding + innerPadding
                const y =
                    cardPadding + innerPadding +
                    index * (photoHeight + spacing)

                // Draw with "object-cover" behavior to avoid stretch:
                const srcW = img.width
                const srcH = img.height
                const srcAspect = srcW / srcH
                const destAspect = photoWidth / photoHeight // 4:3

                let sx = 0
                let sy = 0
                let sw = srcW
                let sh = srcH

                if (srcAspect > destAspect) {
                    // Source is wider than destination: crop width
                    sw = Math.round(srcH * destAspect)
                    sx = Math.round((srcW - sw) / 2)
                } else if (srcAspect < destAspect) {
                    // Source is taller than destination: crop height
                    sh = Math.round(srcW / destAspect)
                    sy = Math.round((srcH - sh) / 2)
                }

                ctx.drawImage(img, sx, sy, sw, sh, x, y, photoWidth, photoHeight)

                if (selectedSticker !== 'none') {
                    const sticker = STICKERS.find(s => s.id === selectedSticker)
                    if (sticker && sticker.emoji) {
                        const stickerFont = Math.round(18 * scale)
                        ctx.font = `${stickerFont}px sans-serif`
                        ctx.fillText(sticker.emoji, x + Math.round(8 * scale), y + Math.round(24 * scale))
                        ctx.fillText(sticker.emoji, x + photoWidth - Math.round(20 * scale), y + Math.round(24 * scale))
                        ctx.fillText(sticker.emoji, x + Math.round(8 * scale), y + photoHeight - Math.round(6 * scale))
                        ctx.fillText(sticker.emoji, x + photoWidth - Math.round(20 * scale), y + photoHeight - Math.round(6 * scale))
                    }
                }

                if (loadedCount === images.length) {
                    // Footer background matches frame color
                    const footerY =
                        cardPadding + (innerPadding * 2) +
                        (photoHeight * capturedImages.length) +
                        (spacing * (capturedImages.length - 1))
                    ctx.fillStyle = frameColor.color
                    ctx.fillRect(0, footerY, outerWidth, footerHeight)

                    // Date only in the footer (centered), smaller and slightly lower
                    ctx.fillStyle = '#ec4899'
                    ctx.textAlign = 'center'
                    ctx.font = `${Math.round(10 * scale)}px Fredoka, sans-serif`
                    ctx.fillText(
                        new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                        outerWidth / 2,
                        footerY + footerHeight - Math.round(8 * scale)
                    )

                    const link = document.createElement('a')
                    link.download = `photobooth-strip-${Date.now()}.png`
                    link.href = stripCanvas.toDataURL('image/png')
                    link.click()
                }
            }
        })
    }, [capturedImages, selectedFrameColor, selectedSticker])

    const retakePhotos = useCallback(() => {
        setCapturedImages([])
        setView('capture')
        setCurrentPhotoIndex(0)
    }, [])

    useEffect(() => {
        return () => {
            stopCamera()
        }
    }, [stopCamera])




    const hasCompletedStrip = capturedImages.length === photoCount && !isCapturing

    if (view === 'capture') {
        return (
            <CameraPage
                onBack={onBack}
                videoRef={videoRef}
                canvasRef={canvasRef}
                isCameraReady={isCameraReady}
                isLoading={isLoading}
                isCapturing={isCapturing}
                countdown={countdown}
                currentPhotoIndex={currentPhotoIndex}
                photoCount={photoCount}
                setPhotoCount={setPhotoCount}
                countdownDelay={countdownDelay}
                setCountdownDelay={setCountdownDelay}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                startCamera={startCamera}
                startPhotoSequence={startPhotoSequence}
                capturedImages={capturedImages}
                hasCompletedStrip={hasCompletedStrip}
                goToPreview={() => setView('preview')}
                filters={FILTERS}
                photoCounts={PHOTO_COUNTS}
                countdownOptions={COUNTDOWN_OPTIONS}
            />
        )
    }

    return (
        <PreviewPage
            onBack={onBack}
            capturedImages={capturedImages}
            selectedFrameColor={selectedFrameColor}
            setSelectedFrameColor={setSelectedFrameColor}
            selectedSticker={selectedSticker}
            setSelectedSticker={setSelectedSticker}
            downloadPhotoStrip={downloadPhotoStrip}
            retakePhotos={retakePhotos}
            frameColors={FRAME_COLORS}
            stickers={STICKERS}
        />
    )
}
