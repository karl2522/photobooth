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
    icons: {
        icon: '/icon.svg',
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
