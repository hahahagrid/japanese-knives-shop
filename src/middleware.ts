import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  
  // We specify credentials in Railway Environment Variables
  const authUser = process.env.BASIC_AUTH_USER
  const authPass = process.env.BASIC_AUTH_PASS
  
  // If credentials are set (which we should do only for Dev/Staging environments)
  if (authUser && authPass) {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      if (user === authUser && pwd === authPass) {
        const response = NextResponse.next()
        // Add No-Index header for extra safety
        response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
        return response
      }
    }

    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  return NextResponse.next()
}

// Match all paths except static files and core APIs
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
}
