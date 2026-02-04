import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req: NextRequest) {
    // Add any additional middleware logic here
    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/signin',
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/beds/:path*',
    '/resources/:path*',
    '/staff/:path*',
    '/settings/:path*'
  ]
}
