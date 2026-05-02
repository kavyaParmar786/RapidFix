import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/signup', '/auth/role-select', '/sso-callback']

// ─── Simple in-memory rate limiter (edge-compatible) ─────────────────────────
// For production with Upstash Redis:
//   1. npm install @upstash/ratelimit @upstash/redis
//   2. Add UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to .env.local
//   3. Replace the map-based limiter below with:
//      import { Ratelimit } from '@upstash/ratelimit'
//      import { Redis } from '@upstash/redis'
//      const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(20, '1 m') })
//      const { success } = await ratelimit.limit(ip)

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60_000   // 1 minute
const RATE_LIMIT_MAX = 30             // requests per window per IP on sensitive API routes

const RATE_LIMITED_ROUTES = [
  '/api/payment/create-order',
  '/api/payout',
  '/api/email',
]

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true // allowed
  }
  entry.count++
  if (entry.count > RATE_LIMIT_MAX) return false // blocked
  return true
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Block /admin entirely at the edge — return 404, don't even hint it exists
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return NextResponse.rewrite(new URL('/not-found', req.url))
  }

  // Rate limit sensitive API routes
  if (RATE_LIMITED_ROUTES.some((r) => pathname.startsWith(r))) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous'

    if (!checkRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again in a minute.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      )
    }
  }

  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))
    || pathname.startsWith('/api/')
    || pathname.startsWith('/_next/')

  if (isPublic) return NextResponse.next()

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
