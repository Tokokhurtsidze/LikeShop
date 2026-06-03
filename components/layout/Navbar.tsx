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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
            L
          </div>
          <span className="font-bold text-gray-900">LikeShop</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href={`/${locale}/listings`}
            className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            {ka ? 'განცხადებები' : 'Listings'}
          </Link>

          {/* Locale switcher */}
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
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {ka ? '+ განცხადება' : '+ Post'}
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
                className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                {ka ? 'შესვლა' : 'Log In'}
              </Link>
              <Link
                href={`/${locale}/auth/register`}
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {ka ? 'რეგისტრაცია' : 'Register'}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
