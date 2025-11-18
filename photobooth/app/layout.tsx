import type { Metadata } from 'next'
import { Fredoka } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const fredoka = Fredoka({
    subsets: ["latin"],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-fredoka'
});

export const metadata: Metadata = {
    title: "Theresa's Photobooth ♡",
    description: 'A modern, minimal pink-themed photobooth to capture and cherish your beautiful moments',
    generator: 'v0.app',
    manifest: '/manifest.json',
    icons: {
        icon: '/icon.svg',
        shortcut: '/icon.svg',
        apple: '/icon.svg',
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: "Theresa's Photobooth",
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
        viewportFit: 'cover',
    },
    other: {
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'apple-mobile-web-app-title': "Theresa's Photobooth",
    },
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
        <body className={`${fredoka.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        </body>
        </html>
    )
}
