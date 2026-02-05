import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add authentication logic here if needed
  // For now, just allow all requests
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
