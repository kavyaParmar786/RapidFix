import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/signup', '/auth/role-select', '/sso-callback']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))
    || pathname.startsWith('/api/')
    || pathname.startsWith('/_next/')

  if (isPublic) return NextResponse.next()

  // Better Auth sets a session cookie — check for it
  const session = req.cookies.get('better-auth.session_token')
    || req.cookies.get('__Secure-better-auth.session_token')

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'],
}
