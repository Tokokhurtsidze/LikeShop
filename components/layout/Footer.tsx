import Link from 'next/link'

interface FooterProps {
  locale: string
}

export function Footer({ locale }: FooterProps) {
  const ka = locale === 'ka'
  const l = `/${locale}/listings`

  const forSale = [
    { label: ka ? '1-ოთახიანი ბინა იყიდება' : '1-room apartment for sale', href: `${l}?transaction=sale&type=apartment&rooms=1` },
    { label: ka ? '2-ოთახიანი ბინა იყიდება' : '2-room apartment for sale', href: `${l}?transaction=sale&type=apartment&rooms=2` },
    { label: ka ? '3-ოთახიანი ბინა იყიდება' : '3-room apartment for sale', href: `${l}?transaction=sale&type=apartment&rooms=3` },
    { label: ka ? '4-ოთახიანი ბინა იყიდება' : '4-room apartment for sale', href: `${l}?transaction=sale&type=apartment&rooms=4` },
    { label: ka ? 'სახლი იყიდება' : 'House for sale', href: `${l}?transaction=sale&type=house` },
    { label: ka ? 'კოტეჯი იყიდება' : 'Summer cottage for sale', href: `${l}?transaction=sale&type=cottage` },
    { label: ka ? 'კომერციული ფართი იყიდება' : 'Commercial property for sale', href: `${l}?transaction=sale&type=commercial` },
  ]

  const forRent = [
    { label: ka ? '1-ოთახიანი ბინა ქირავდება' : '1-room apartment for rent', href: `${l}?transaction=rent_monthly&type=apartment&rooms=1` },
    { label: ka ? '2-ოთახიანი ბინა ქირავდება' : '2-room apartment for rent', href: `${l}?transaction=rent_monthly&type=apartment&rooms=2` },
    { label: ka ? '3-ოთახიანი ბინა ქირავდება' : '3-room apartment for rent', href: `${l}?transaction=rent_monthly&type=apartment&rooms=3` },
    { label: ka ? '4-ოთახიანი ბინა ქირავდება' : '4-room apartment for rent', href: `${l}?transaction=rent_monthly&type=apartment&rooms=4` },
    { label: ka ? 'სახლი ქირავდება' : 'House for rent', href: `${l}?transaction=rent_monthly&type=house` },
    { label: ka ? 'კოტეჯი ქირავდება' : 'Summer cottage for rent', href: `${l}?transaction=rent_monthly&type=cottage` },
    { label: ka ? 'კომერციული ფართი ქირავდება' : 'Commercial property for rent', href: `${l}?transaction=rent_monthly&type=commercial` },
    { label: ka ? 'დღიური ქირა' : 'Daily renting', href: `${l}?transaction=rent_daily` },
  ]

  const apartments = [
    { label: ka ? 'ბინები საბურთალოზე' : 'Apartments in Saburtalo', href: `${l}?type=apartment&region=თბილისი` },
    { label: ka ? 'ბინები ვაკეში' : 'Apartments in Vake', href: `${l}?type=apartment&region=თბილისი` },
    { label: ka ? 'ბინები დიღომში' : 'Apartments in Digomi', href: `${l}?type=apartment&region=თბილისი` },
    { label: ka ? 'ბინები გლდანში' : 'Apartments in Gldani', href: `${l}?type=apartment&region=თბილისი` },
    { label: ka ? 'ბინები ვარკეთილში' : 'Apartments in Varketili', href: `${l}?type=apartment&region=თბილისი` },
    { label: ka ? 'ბინები ჩუღურეთში' : 'Apartments in Chugureti', href: `${l}?type=apartment&region=თბილისი` },
    { label: ka ? 'ბინები ძველ თბილისში' : 'Apartments in Old Tbilisi', href: `${l}?type=apartment&region=თბილისი` },
  ]

  const usefulLinks = [
    { label: ka ? 'განცხადების წესები' : 'Rules for placing an ad', href: `/${locale}/listings` },
    { label: ka ? 'როგორ დავდო განცხადება' : 'How to place an ad', href: `/${locale}/dashboard/new` },
    { label: ka ? 'როგორ დავრეგისტრირდე' : 'How to sign up', href: `/${locale}/auth/register` },
    { label: ka ? 'გადახდილი სერვისები' : 'Paid services', href: `/${locale}/listings` },
    { label: ka ? 'კონფიდენციალურობა' : 'Privacy Policy', href: `/${locale}/listings` },
  ]

  return (
    <footer className="mt-20 border-t border-gray-200 bg-gray-50">
      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {/* For sale */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {ka ? 'იყიდება' : 'For sale'}
            </h3>
            <ul className="flex flex-col gap-2">
              {forSale.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-gray-500 hover:text-blue-600 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For rent */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {ka ? 'ქირავდება' : 'For rent'}
            </h3>
            <ul className="flex flex-col gap-2">
              {forRent.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href} className="text-xs text-gray-500 hover:text-blue-600 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Apartments */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {ka ? 'ბინები' : 'Apartments'}
            </h3>
            <ul className="flex flex-col gap-2">
              {apartments.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-xs text-gray-500 hover:text-blue-600 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {ka ? 'სასარგებლო ბმულები' : 'Useful links'}
            </h3>
            <ul className="flex flex-col gap-2">
              {usefulLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-xs text-gray-500 hover:text-blue-600 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {ka ? 'დახმარება' : 'Help'}
            </h3>
            <p className="text-xs text-gray-500">{ka ? 'ცხელი ხაზი' : 'Hotline'}</p>
            <p className="mt-1 text-sm font-bold text-gray-900">0322 121 661</p>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                href={`/${locale}/auth/register`}
                className="text-xs text-gray-500 hover:text-blue-600 hover:underline"
              >
                {ka ? 'რეგისტრაცია' : 'Sign up'}
              </Link>
              <Link
                href={`/${locale}/auth/login`}
                className="text-xs text-gray-500 hover:text-blue-600 hover:underline"
              >
                {ka ? 'შესვლა' : 'Log in'}
              </Link>
              <Link
                href={`/${locale}/dashboard/new`}
                className="text-xs text-gray-500 hover:text-blue-600 hover:underline"
              >
                {ka ? 'განცხადების დამატება' : 'Post an ad'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
              L
            </div>
            <span className="text-sm font-semibold text-gray-900">LikeShop</span>
          </div>

          {/* Locale switcher */}
          <div className="flex items-center gap-2">
            <Link
              href={`/ka${''}`}
              className={`rounded px-2 py-1 text-xs font-medium ${locale === 'ka' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              ქართული
            </Link>
            <Link
              href={`/en${''}`}
              className={`rounded px-2 py-1 text-xs font-medium ${locale === 'en' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              English
            </Link>
          </div>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} LikeShop. {ka ? 'ყველა უფლება დაცულია' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
