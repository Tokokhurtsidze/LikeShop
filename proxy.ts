import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { auth } from '@/lib/auth'

const intlMiddleware = createIntlMiddleware(routing)

export default auth(async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  // @ts-expect-error auth wraps request with session
  const session = req.auth

  const isDashboard = /^\/[a-z]{2}\/dashboard/.test(pathname)
  if (isDashboard && !session) {
    const locale = pathname.split('/')[1] ?? 'ka'
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url))
  }

  return intlMiddleware(req)
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
