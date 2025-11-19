'use client'

import CameraPage from '@/components/CameraPage'
import PreviewPage from '@/components/PreviewPage'
import { getDecorLayout } from '@/components/decorLayout'
import { useCallback, useEffect, useRef, useState } from 'react'

const FILTERS = [
    { id: 'none', name: 'Original', class: '' },
    { id: 'sepia', name: 'Vintage', class: 'sepia-[0.8] contrast-[1.1]' },
    { id: 'grayscale', name: 'B&W', class: 'grayscale contrast-[1.2]' },
    { id: 'saturate', name: 'Pop', class: 'saturate-[1.5] contrast-[1.1]' },
    { id: 'hue', name: 'Dreamy', class: 'hue-rotate-[320deg] saturate-[1.2]' },
    { id: 'warm', name: 'Warm', class: 'sepia-[0.3] saturate-[1.3] brightness-[1.05]' },
    { id: 'noir', name: 'Noir', class: 'grayscale contrast-[1.4] brightness-[0.9]' },
    { id: 'vivid', name: 'Vivid', class: 'saturate-[1.8] contrast-[1.15]' },
    { id: 'cool', name: 'Cool', class: 'hue-rotate-[200deg] saturate-[1.2]' },
    { id: 'peach', name: 'Peach', class: 'sepia-[0.1] hue-rotate-[320deg] saturate-[1.3] brightness-[1.05]' },
    { id: 'cinematic', name: 'Cinematic', class: 'contrast-[1.3] saturate-[0.9] brightness-[0.9]' },
]

const PHOTO_COUNTS = [2, 3, 4]
const COUNTDOWN_OPTIONS = [3, 5, 10]

const FRAME_COLORS = [
    { id: 'white', name: 'White', color: '#ffffff', border: '#e5e7eb' },
    { id: 'pink', name: 'Pink', color: '#fce7f3', border: '#f9a8d4' },
    { id: 'lavender', name: 'Lavender', color: '#f3e8ff', border: '#d8b4fe' },
    { id: 'blue', name: 'Blue', color: '#dbeafe', border: '#93c5fd' },
    { id: 'mint', name: 'Mint', color: '#d1fae5', border: '#6ee7b7' },
    // Added extra palette options (flat colors only)
    { id: 'peach', name: 'Peach', color: '#ffe4e6', border: '#f9a8a8' },
    { id: 'gold', name: 'Gold', color: '#fef3c7', border: '#facc15' },
    { id: 'cream', name: 'Cream', color: '#fff7ed', border: '#fed7aa' },
    { id: 'aqua', name: 'Aqua', color: '#cffafe', border: '#67e8f9' },
    { id: 'gray', name: 'Gray', color: '#f3f4f6', border: '#d1d5db' },
]

const STICKERS = [
    { id: 'none', name: 'None' },
    { id: 'hearts', name: 'Hearts' },
    { id: 'flowers', name: 'Flowers' },
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
    const [shutterActive, setShutterActive] = useState(false)

    const [view, setView] = useState<'capture' | 'preview'>('capture')

    const [selectedFrameColor, setSelectedFrameColor] = useState('white')
    const [selectedSticker, setSelectedSticker] = useState('none')
    const [iosRotationFix, setIosRotationFix] = useState({ active: false, scale: 1 })

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

        const shouldRotate = iosRotationFix.active && video.videoHeight > video.videoWidth
        if (shouldRotate) {
            canvas.width = video.videoHeight
            canvas.height = video.videoWidth
        } else {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
        }

        const context = canvas.getContext('2d')
        if (context) {
            const filter = FILTERS.find(f => f.id === selectedFilter)
            // Ensure captured image matches preview filter
            switch (filter?.id) {
                case 'sepia':
                    context.filter = 'sepia(0.8) contrast(1.1)'
                    break
                case 'grayscale':
                    context.filter = 'grayscale(1) contrast(1.2)'
                    break
                case 'saturate':
                    context.filter = 'saturate(1.5) contrast(1.1)'
                    break
                case 'hue':
                    context.filter = 'hue-rotate(320deg) saturate(1.2)'
                    break
                case 'warm':
                    context.filter = 'sepia(0.3) saturate(1.3) brightness(1.05)'
                    break
                case 'noir':
                    context.filter = 'grayscale(1) contrast(1.4) brightness(0.9)'
                    break
                case 'vivid':
                    context.filter = 'saturate(1.8) contrast(1.15)'
                    break
                case 'cool':
                    context.filter = 'hue-rotate(200deg) saturate(1.2)'
                    break
                case 'peach':
                    context.filter = 'sepia(0.1) hue-rotate(320deg) saturate(1.3) brightness(1.05)'
                    break
                case 'cinematic':
                    context.filter = 'contrast(1.3) saturate(0.9) brightness(0.9)'
                    break
                default:
                    context.filter = 'none'
            }

            // Flip horizontally to match camera view (which uses -scale-x-100)
            context.save()
            context.translate(canvas.width, 0)
            context.scale(-1, 1)
            if (shouldRotate) {
                context.save()
                context.translate(canvas.width / 2, canvas.height / 2)
                context.rotate((-90 * Math.PI) / 180)
                context.drawImage(video, -canvas.height / 2, -canvas.width / 2, canvas.height, canvas.width)
                context.restore()
            } else {
                context.drawImage(video, 0, 0, canvas.width, canvas.height)
            }
            context.restore()
            // trigger a subtle shutter flash after capture
            setShutterActive(true)
            setTimeout(() => setShutterActive(false), 180)
            return canvas.toDataURL('image/png')
        }
        return null
    }, [isCameraReady, selectedFilter, iosRotationFix])

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

    const downloadPhotoStrip = useCallback(async () => {
        if (capturedImages.length === 0) return

        const stripCanvas = document.createElement('canvas')
        const ctx = stripCanvas.getContext('2d')
        if (!ctx) return

        // Export at a larger size while keeping the same proportions as the preview.
        // Base preview outer width is 250px. Scale all paddings/spacing/fonts from that.
        const baseOuterWidth = 250
        const exportOuterWidth = 600 // make the downloadable strip larger
        const scale = exportOuterWidth / baseOuterWidth

        const outerWidth = exportOuterWidth
        const cardPadding = Math.round(12 * scale)
        const innerPadding = Math.round(12 * scale)
        const contentWidth = outerWidth - 2 * (cardPadding + innerPadding)
        const photoWidth = contentWidth
        const photoHeight = Math.round(contentWidth * 3 / 4) // 4:3 tiles
        const spacing = Math.round(6 * scale)
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
        // Support gradients when provided
        const hasGradient = (frameColor as any).gradientFrom && (frameColor as any).gradientTo
        if (hasGradient) {
            const grad = ctx.createLinearGradient(0, 0, stripCanvas.width, stripCanvas.height)
            grad.addColorStop(0, (frameColor as any).gradientFrom)
            grad.addColorStop(1, (frameColor as any).gradientTo)
            ctx.fillStyle = grad
        } else {
            ctx.fillStyle = frameColor.color
        }
        ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height)

        // Inner colored frame background
        const frameX = cardPadding
        const frameY = cardPadding
        const frameW = outerWidth - cardPadding * 2
        const frameH =
            (innerPadding * 2) +
            (photoHeight * capturedImages.length) +
            (spacing * (capturedImages.length - 1))
        if (hasGradient) {
            const gradInner = ctx.createLinearGradient(frameX, frameY, frameX + frameW, frameY + frameH)
            gradInner.addColorStop(0, (frameColor as any).gradientFrom)
            gradInner.addColorStop(1, (frameColor as any).gradientTo)
            ctx.fillStyle = gradInner
        } else {
            ctx.fillStyle = frameColor.color
        }
        ctx.fillRect(frameX, frameY, frameW, frameH)

        // Preload sticker SVGs for hearts / flowers variants from /public
        const loadImg = (src: string) =>
            new Promise<HTMLImageElement>((resolve) => {
                const img = new Image()
                img.crossOrigin = 'anonymous'
                img.src = src
                img.onload = () => resolve(img)
            })
        const stickerMap: Record<string, HTMLImageElement[]> = {}
        if (selectedSticker === 'hearts') {
            stickerMap['hearts'] = await Promise.all(['/heart1.svg', '/heart2.svg', '/heart3.svg'].map(loadImg))
        } else if (selectedSticker === 'flowers') {
            stickerMap['flowers'] = await Promise.all(['/flower1.svg', '/flower2.svg', '/flower3.svg'].map(loadImg))
        }

        // Helper to draw cute stickers on the frame border (not on photos)
        const drawCuteSticker = (x: number, y: number, size: number, kind: string, rotationDeg: number = 0) => {
            ctx.save()
            ctx.translate(x, y)
            if (rotationDeg) ctx.rotate((rotationDeg * Math.PI) / 180)
            if (kind === 'hearts') {
                ctx.fillStyle = '#f472b6'
                ctx.beginPath()
                ctx.moveTo(0, size * 0.35)
                ctx.bezierCurveTo(0, 0, size * 0.5, 0, size * 0.5, size * 0.35)
                ctx.bezierCurveTo(size * 0.5, 0, size, 0, size, size * 0.35)
                ctx.bezierCurveTo(size, size * 0.7, size * 0.6, size * 0.9, size * 0.5, size)
                ctx.bezierCurveTo(size * 0.4, size * 0.9, 0, size * 0.7, 0, size * 0.35)
                ctx.fill()
            } else if (kind === 'bows') {
                ctx.fillStyle = '#f9a8d4'
                ctx.beginPath()
                ctx.moveTo(size * 0.5, size * 0.45)
                ctx.bezierCurveTo(size * 0.7, size * 0.1, size, size * 0.2, size, size * 0.5)
                ctx.bezierCurveTo(size, size * 0.8, size * 0.7, size * 0.9, size * 0.5, size * 0.6)
                ctx.bezierCurveTo(size * 0.3, size * 0.9, 0, size * 0.8, 0, size * 0.5)
                ctx.bezierCurveTo(0, size * 0.2, size * 0.3, size * 0.1, size * 0.5, size * 0.45)
                ctx.fill()
                ctx.fillStyle = '#ec4899'
                ctx.beginPath()
                ctx.arc(size * 0.5, size * 0.52, size * 0.12, 0, Math.PI * 2)
                ctx.fill()
            } else if (kind === 'butterflies') {
                ctx.fillStyle = '#fb7185'
                ctx.beginPath()
                ctx.moveTo(size * 0.5, size * 0.5)
                ctx.bezierCurveTo(size * 0.1, size * 0.1, 0, size * 0.4, size * 0.2, size * 0.6)
                ctx.bezierCurveTo(size * 0.35, size * 0.8, size * 0.5, size * 0.6, size * 0.5, size * 0.5)
                ctx.fill()
                ctx.fillStyle = '#f472b6'
                ctx.beginPath()
                ctx.moveTo(size * 0.5, size * 0.5)
                ctx.bezierCurveTo(size * 0.9, size * 0.1, size, size * 0.4, size * 0.8, size * 0.6)
                ctx.bezierCurveTo(size * 0.65, size * 0.8, size * 0.5, size * 0.6, size * 0.5, size * 0.5)
                ctx.fill()
                ctx.fillStyle = '#9d174d'
                ctx.fillRect(size * 0.48, size * 0.45, size * 0.04, size * 0.2)
            } else if (kind === 'flowers') {
                const petals = 6
                for (let i = 0; i < petals; i++) {
                    const a = (i / petals) * Math.PI * 2
                    ctx.fillStyle = i % 2 ? '#fb7185' : '#f472b6'
                    ctx.beginPath()
                    ctx.ellipse(
                        size * 0.5 + Math.cos(a) * size * 0.22,
                        size * 0.5 + Math.sin(a) * size * 0.22,
                        size * 0.18,
                        size * 0.1,
                        a,
                        0,
                        Math.PI * 2
                    )
                    ctx.fill()
                }
                ctx.fillStyle = '#fda4af'
                ctx.beginPath()
                ctx.arc(size * 0.5, size * 0.5, size * 0.12, 0, Math.PI * 2)
                ctx.fill()
            } else if (kind === 'ribbons') {
                ctx.fillStyle = '#f9a8d4'
                ctx.beginPath()
                ctx.moveTo(0, size * 0.3)
                ctx.quadraticCurveTo(size * 0.35, size * 0.1, size * 0.6, size * 0.4)
                ctx.quadraticCurveTo(size * 0.8, size * 0.6, size, size * 0.4)
                ctx.lineTo(size * 0.85, size * 0.55)
                ctx.quadraticCurveTo(size * 0.6, size * 0.75, size * 0.35, size * 0.45)
                ctx.quadraticCurveTo(size * 0.15, size * 0.25, 0, size * 0.45)
                ctx.closePath()
                ctx.fill()
            } else if (kind === 'pearls') {
                // soft pink pearl with highlight and outline
                const grad = ctx.createRadialGradient(
                    size * 0.45, size * 0.45, size * 0.05,
                    size * 0.5, size * 0.5, size * 0.25
                )
                grad.addColorStop(0, '#ffe5ee')
                grad.addColorStop(1, '#f5a3c0')
                ctx.fillStyle = grad
                ctx.beginPath()
                ctx.arc(size * 0.5, size * 0.5, size * 0.22, 0, Math.PI * 2)
                ctx.fill()
                ctx.strokeStyle = '#f39bc2'
                ctx.lineWidth = Math.max(1, size * 0.06)
                ctx.stroke()
                ctx.fillStyle = 'rgba(255,255,255,0.55)'
                ctx.beginPath()
                ctx.arc(size * 0.42, size * 0.42, size * 0.07, 0, Math.PI * 2)
                ctx.fill()
            }
            ctx.restore()
        }

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

                // emoji-based fallback removed; using SVG-based border stickers only

                if (loadedCount === images.length) {
                    // Footer background matches frame color
                    const footerY =
                        cardPadding + (innerPadding * 2) +
                        (photoHeight * capturedImages.length) +
                        (spacing * (capturedImages.length - 1))
                    ctx.fillStyle = frameColor.color
                    ctx.fillRect(0, footerY, outerWidth, footerHeight)

                    // Draw border stickers around the frame (corners + along sides), not on photos
                    if (selectedSticker !== 'none') {
                        const s = selectedSticker
                        const borderThickness = cardPadding
                        const bandThickness = cardPadding + innerPadding // include inner padding for preview parity
                        // base sizes limited to border band to avoid overlapping the photo
                        const sizeCornerBase = Math.max(6, Math.round(bandThickness * 0.98))
                        const sizeTopBase = Math.max(6, Math.round(bandThickness * 0.98))
                        const sizeSideBase = Math.max(6, Math.round(bandThickness * 0.98))
                        // corners centered within border band (use band center to avoid touching photo)
                        const drawStickerImg = (img: HTMLImageElement | undefined, x: number, y: number, size: number, rot: number) => {
                            if (img) {
                                ctx.save()
                                ctx.translate(x, y)
                                if (rot) ctx.rotate((rot * Math.PI) / 180)
                                ctx.drawImage(img, 0, 0, size, size)
                                ctx.restore()
                            } else {
                                drawCuteSticker(x, y, size, s, rot)
                            }
                        }
                        const bandCenter = cardPadding + (innerPadding / 2) // cardPadding + innerPadding/2
                        drawStickerImg(stickerMap[s]?.[0], bandCenter - sizeCornerBase / 2, bandCenter - sizeCornerBase / 2, sizeCornerBase, 0)
                        drawStickerImg(stickerMap[s]?.[1], outerWidth - bandCenter - sizeCornerBase / 2, bandCenter - sizeCornerBase / 2, sizeCornerBase, 0)
                        drawStickerImg(stickerMap[s]?.[2], bandCenter - sizeCornerBase / 2, frameY + frameH - bandCenter - sizeCornerBase / 2, sizeCornerBase, 0)
                        drawStickerImg(stickerMap[s]?.[1], outerWidth - bandCenter - sizeCornerBase / 2, frameY + frameH - bandCenter - sizeCornerBase / 2, sizeCornerBase, 0)
                        // Match preview: percentage positions along edges (within border band)
                        const layout = getDecorLayout(s)
                        layout.forEach((pt, idx) => {
                            if (pt.edge === 'top' || pt.edge === 'bottom') {
                                const size = Math.min(bandThickness, Math.round(sizeTopBase * pt.sizeScale))
                                const innerWidth = outerWidth - (bandCenter * 2) - size
                                const x = Math.round(bandCenter + (pt.percent / 100) * innerWidth)
                                const y = pt.edge === 'top'
                                    ? bandCenter - size / 2
                                    : frameY + frameH - bandCenter - size / 2
                                const img = stickerMap[s]?.[idx % (stickerMap[s]?.length || 1)]
                                drawStickerImg(img, x, y, size, pt.rotationDeg)
                            } else {
                                const size = Math.min(bandThickness, Math.round(sizeSideBase * pt.sizeScale))
                                const innerHeight = frameH - (bandCenter * 2) - size
                                const y = Math.round(frameY + bandCenter + (pt.percent / 100) * innerHeight)
                                const x = pt.edge === 'left'
                                    ? bandCenter - size / 2
                                    : outerWidth - bandCenter - size / 2
                                const img = stickerMap[s]?.[idx % (stickerMap[s]?.length || 1)]
                                drawStickerImg(img, x, y, size, pt.rotationDeg)
                            }
                        })
                    }

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

    // Track previous view to detect when returning from preview
    const prevViewRef = useRef<'capture' | 'preview'>('capture')

    const retakePhotos = useCallback(() => {
        setCapturedImages([])
        setView('capture')
        setCurrentPhotoIndex(0)
    }, [])

    // Only handle camera reattachment when returning from preview view
    useEffect(() => {
        const prevView = prevViewRef.current
        prevViewRef.current = view

        // Only act when switching FROM preview TO capture (retake scenario)
        if (prevView === 'preview' && view === 'capture' && videoRef.current) {
            // If we have an existing active stream, reattach it to the video element
            if (stream && stream.active) {
                if (videoRef.current.srcObject !== stream) {
                    videoRef.current.srcObject = stream
                    videoRef.current.play().catch(console.error)
                }
                // Ensure camera ready state is set if stream is active
                if (!isCameraReady) {
                    setIsCameraReady(true)
                }
            } else if (!isLoading) {
                // Stream was stopped or doesn't exist, restart camera
                startCamera()
            }
        }
    }, [view, stream, isCameraReady, isLoading, startCamera])

    useEffect(() => {
        return () => {
            stopCamera()
        }
    }, [stopCamera])

    useEffect(() => {
        if (!isCameraReady) {
            if (iosRotationFix.active) {
                setIosRotationFix({ active: false, scale: 1 })
            }
            return
        }

        if (typeof window === 'undefined') return
        const nav = window.navigator as Navigator & { standalone?: boolean }
        const isStandalone = nav.standalone === true
        const ua = window.navigator.userAgent
        const isIPad = /iPad|Macintosh/.test(ua) && 'ontouchend' in document

        if (!isStandalone || !isIPad) {
            if (iosRotationFix.active) {
                setIosRotationFix({ active: false, scale: 1 })
            }
            return
        }

        const video = videoRef.current
        if (!video) return

        let raf: number
        const checkOrientation = () => {
            if (!video.videoWidth || !video.videoHeight) {
                raf = window.requestAnimationFrame(checkOrientation)
                return
            }
            const rotated = video.videoHeight > video.videoWidth
            if (rotated) {
                const scale = video.videoHeight / video.videoWidth
                setIosRotationFix({ active: true, scale })
            } else if (iosRotationFix.active) {
                setIosRotationFix({ active: false, scale: 1 })
            }
        }

        raf = window.requestAnimationFrame(checkOrientation)
        return () => {
            window.cancelAnimationFrame(raf)
        }
    }, [isCameraReady, iosRotationFix.active, stopCamera])




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
                shutterActive={shutterActive}
            iosRotationFix={iosRotationFix}
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
