import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isDashboard = /^\/[a-z]{2}\/dashboard/.test(pathname)
  if (isDashboard) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET })
    if (!token) {
      const locale = pathname.split('/')[1] ?? 'ka'
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url))
    }
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
