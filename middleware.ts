import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host') || ''

  // Support local development (admin.localhost:3000) and production (admin.verusmart.com)
  const isAdminSubdomain = hostname.startsWith('admin.verusmart.com') || hostname.startsWith('admin.localhost')

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', url.pathname)

  if (isAdminSubdomain) {
    // If accessing root, rewrite to /admin
    if (url.pathname === '/') {
      url.pathname = '/admin'
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        }
      })
    }
    
    // If requesting normal admin subpaths, keep them, otherwise prepend /admin
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        }
      })
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin_uploads (uploaded assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin_uploads).*)',
  ],
}
