import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for Basic Authentication and SEO protection.
 * Only activates if BASIC_AUTH_USER and BASIC_AUTH_PASS exist in the environment.
 * If configured, it prompts for credentials.
 * If authenticated (on dev/staging), it also injeсts a noindex header for search engine protection.
 * On production (where variables are missing), it remains completely transparent.
 */
export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  
  // These credentials should only be set in the Railway 'develop' environment variables
  const authUser = process.env.BASIC_AUTH_USER
  const authPass = process.env.BASIC_AUTH_PASS
  
  // ENVIRONMENT CHECK: If credentials are set, authentication is REQUIRED
  if (authUser && authPass) {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      // SUCCESSFUL LOGIN: Proceed to the site and block indexing
      if (user === authUser && pwd === authPass) {
        const response = NextResponse.next()
        // Add No-Index headers for crawler protection on dev/staging environment
        response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
        return response
      }
    }

    // LOGIN FAILED or NO LOGIN: Request authentication via browser prompt
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  // PRODUCTION FALLBACK: No credentials configured, allow access to everyone
  return NextResponse.next()
}

// Configuration: Block all paths except specific internal Next.js/Public resources
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
}
