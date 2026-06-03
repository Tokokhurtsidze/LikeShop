import Link from 'next/link'
import { auth } from '@/lib/auth'
import { AccountMenu } from './AccountMenu'

interface NavbarProps {
  locale: string
}

export async function Navbar({ locale }: NavbarProps) {
  const session = await auth()
  const ka = locale === 'ka'

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            L
          </div>
          <span className="hidden font-bold text-gray-900 sm:block">LikeShop</span>
        </Link>

        {/* Right nav */}
        <nav className="flex items-center gap-1">
          <Link
            href={`/${locale}/listings`}
            className="hidden rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 sm:block"
          >
            {ka ? 'განცხადებები' : 'Listings'}
          </Link>

          <Link
            href={locale === 'ka' ? '/en' : '/ka'}
            className="rounded-lg px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
          >
            {locale === 'ka' ? 'EN' : 'KA'}
          </Link>

          {session ? (
            <>
              <Link
                href={`/${locale}/dashboard/new`}
                className="rounded-lg bg-blue-600 px-2.5 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:px-3"
              >
                <span className="sm:hidden">+</span>
                <span className="hidden sm:inline">{ka ? '+ განცხადება' : '+ Post'}</span>
              </Link>
              <AccountMenu
                name={session.user?.name}
                email={session.user?.email}
                image={session.user?.image}
                locale={locale}
              />
            </>
          ) : (
            <>
              <Link
                href={`/${locale}/auth/login`}
                className="rounded-lg px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                {ka ? 'შესვლა' : 'Login'}
              </Link>
              <Link
                href={`/${locale}/auth/register`}
                className="rounded-lg bg-blue-600 px-2.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {ka ? 'რეგ.' : 'Register'}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
