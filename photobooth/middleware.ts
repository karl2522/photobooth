import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
	const { pathname } = new URL(req.url)
	if (pathname === '/favicon.ico') {
		return NextResponse.rewrite(new URL('/icon.svg', req.url))
	}
	return NextResponse.next()
}

export const config = {
	matcher: ['/favicon.ico'],
}


