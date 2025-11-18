import React from 'react'
import { cn } from '@/lib/utils'

type DecorationWrapperProps = {
    icon: React.ReactNode
    style?: React.CSSProperties
    kind: string
}

export function DecorationWrapper({ icon, style, kind }: DecorationWrapperProps) {
    const decorationStyles = {
        hearts: {
            bg: 'bg-white/90',
            border: 'border-pink-400',
            borderWidth: 'border-2',
            shadow: 'shadow-lg shadow-pink-300/70',
            innerPadding: 'p-1.5',
        },
        bows: {
            bg: 'bg-white/90',
            border: 'border-rose-400',
            borderWidth: 'border-2',
            shadow: 'shadow-lg shadow-rose-300/70',
            innerPadding: 'p-1.5',
        },
        butterflies: {
            bg: 'bg-white/90',
            border: 'border-pink-300',
            borderWidth: 'border-2',
            shadow: 'shadow-lg shadow-pink-300/60',
            innerPadding: 'p-1.5',
        },
        flowers: {
            bg: 'bg-white/90',
            border: 'border-rose-300',
            borderWidth: 'border-2',
            shadow: 'shadow-lg shadow-rose-300/60',
            innerPadding: 'p-1.5',
        },
        ribbons: {
            bg: 'bg-white/90',
            border: 'border-pink-400',
            borderWidth: 'border-2',
            shadow: 'shadow-lg shadow-pink-300/70',
            innerPadding: 'p-1.5',
        },
        pearls: {
            bg: 'bg-white/90',
            border: 'border-rose-200',
            borderWidth: 'border-2',
            shadow: 'shadow-lg shadow-rose-200/60',
            innerPadding: 'p-1',
        },
    }

    const style_config = decorationStyles[kind as keyof typeof decorationStyles] || decorationStyles.hearts

    return (
        <div
            className={cn(
                'absolute flex items-center justify-center',
                'rounded-full backdrop-blur-sm',
                style_config.borderWidth,
                style_config.border,
                style_config.bg,
                style_config.shadow,
                'drop-shadow-md'
            )}
            style={{
                ...style,
                aspectRatio: '1',
            }}
        >
            <div className={cn('w-full h-full flex items-center justify-center', style_config.innerPadding)}>
                {icon}
            </div>
        </div>
    )
}
