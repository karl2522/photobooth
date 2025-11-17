import { NextResponse } from 'next/server'

export function GET(req: Request) {
	// Redirect /favicon.ico requests to our themed SVG icon
	return NextResponse.redirect(new URL('/icon.svg', req.url), 308)
}


