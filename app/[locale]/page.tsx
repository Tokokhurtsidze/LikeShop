import Link from 'next/link'
import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import { Listing } from '@/models/Listing'
import { ListingCarousel } from '@/components/listings/ListingCarousel'
import { SearchBar } from '@/components/search/SearchBar'

export const revalidate = 1800

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ka' ? 'LikeShop — უძრავი ქონება საქართველოში' : 'LikeShop — Georgian Real Estate Marketplace',
    description: locale === 'ka'
      ? 'იძებნეთ ბინები, სახლები და კომერციული ფართები გასაყიდად და გასაქირავებლად საქართველოში'
      : 'Search apartments, houses, cottages and commercial spaces for sale and rent across Georgia',
    alternates: { canonical: `/${locale}`, languages: { 'ka': '/ka', 'en': '/en' } },
    openGraph: {
      title: locale === 'ka' ? 'LikeShop — უძრავი ქონება' : 'LikeShop — Georgian Real Estate',
      description: locale === 'ka' ? 'უძრავი ქონება საქართველოში' : 'Real estate marketplace in Georgia',
      locale: locale === 'ka' ? 'ka_GE' : 'en_US',
      alternateLocale: locale === 'ka' ? 'en_US' : 'ka_GE',
    },
  }
}

async function getHomeData() {
  try {
    await connectDB()
    const [featured, popular, forSale, forRent, stats, categoryCounts, regionCounts] =
      await Promise.all([
        Listing.find({ status: 'active', featured: true })
          .sort({ createdAt: -1 })
          .limit(6)
          .lean(),
        Listing.find({ status: 'active' })
          .sort({ views: -1 })
          .limit(6)
          .lean(),
        Listing.find({ status: 'active', transactionType: 'sale' })
          .sort({ createdAt: -1 })
          .limit(6)
          .lean(),
        Listing.find({ status: 'active', transactionType: 'rent_monthly' })
          .sort({ createdAt: -1 })
          .limit(6)
          .lean(),
        Listing.countDocuments({ status: 'active' }),
        Listing.aggregate([
          { $match: { status: 'active' } },
          { $group: { _id: '$propertyType', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Listing.aggregate([
          { $match: { status: 'active' } },
          { $group: { _id: '$location.region', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 8 },
        ]),
      ])
    return {
      featured: JSON.parse(JSON.stringify(featured)),
      popular: JSON.parse(JSON.stringify(popular)),
      forSale: JSON.parse(JSON.stringify(forSale)),
      forRent: JSON.parse(JSON.stringify(forRent)),
      totalListings: stats,
      categoryCounts,
      regionCounts,
    }
  } catch {
    return {
      featured: [], popular: [], forSale: [], forRent: [],
      totalListings: 0, categoryCounts: [], regionCounts: [],
    }
  }
}

const categoryMeta: Record<string, { icon: string; en: string; ka: string }> = {
  apartment: { icon: '🏢', en: 'Apartments', ka: 'ბინები' },
  house:     { icon: '🏠', en: 'Houses',     ka: 'სახლები' },
  cottage:   { icon: '🏡', en: 'Cottages',   ka: 'კოტეჯები' },
  commercial:{ icon: '🏪', en: 'Commercial', ka: 'კომერციული' },
  land:      { icon: '🌿', en: 'Land',       ka: 'მიწა' },
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const ka = locale === 'ka'
  const { featured, popular, forSale, forRent, totalListings, categoryCounts, regionCounts } =
    await getHomeData()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 px-4 py-20 text-white sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl">
            {ka ? 'იპოვე შენი იდეალური უძრავი ქონება საქართველოში' : 'Find Your Perfect Property in Georgia'}
          </h1>
          <p className="mb-8 text-lg text-blue-100">
            {ka
              ? 'ათასობით ბინა, სახლი და კომერციული ფართი გასაყიდად და გასაქირავებლად'
              : 'Thousands of apartments, houses and commercial spaces for sale and rent'}
          </p>
          <div className="mx-auto max-w-xl">
            <SearchBar locale={locale} placeholder={ka ? 'მოძებნეთ განცხადება...' : 'Search listings...'} />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              { label: ka ? 'იყიდება' : 'For Sale', href: `/${locale}/listings?transaction=sale` },
              { label: ka ? 'ქირავდება' : 'For Rent', href: `/${locale}/listings?transaction=rent_monthly` },
              { label: ka ? 'დღიური ქირა' : 'Daily Rent', href: `/${locale}/listings?transaction=rent_daily` },
              { label: ka ? 'ბინა' : 'Apartments', href: `/${locale}/listings?type=apartment` },
              { label: ka ? 'სახლი' : 'Houses', href: `/${locale}/listings?type=house` },
            ].map((pill) => (
              <Link
                key={pill.label}
                href={pill.href}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm hover:bg-white/20"
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live stats bar */}
      <section className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
          <span>🏠 {totalListings.toLocaleString()} {ka ? 'განცხადება' : 'Listings'}</span>
          <span>📍 {ka ? 'საქართველოს ყველა რეგიონი' : 'All Regions of Georgia'}</span>
          <span>✅ {ka ? 'გადამოწმებული განცხადებები' : 'Verified Listings'}</span>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 flex flex-col gap-14">

        {/* Browse by category */}
        {categoryCounts.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              {ka ? '🔍 კატეგორიით ძიება' : '🔍 Browse by Category'}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {categoryCounts.map((c: { _id: string; count: number }) => {
                const meta = categoryMeta[c._id] ?? { icon: '🏘️', en: c._id, ka: c._id }
                return (
                  <Link
                    key={c._id}
                    href={`/${locale}/listings?type=${c._id}`}
                    className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <span className="text-3xl">{meta.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{ka ? meta.ka : meta.en}</span>
                    <span className="text-xs text-gray-400">{c.count} {ka ? 'განცხადება' : 'listings'}</span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Browse by region */}
        {regionCounts.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              {ka ? '📍 რეგიონის მიხედვით' : '📍 Browse by Region'}
            </h2>
            <div className="flex flex-wrap gap-3">
              {regionCounts.map((r: { _id: string; count: number }) => (
                <Link
                  key={r._id}
                  href={`/${locale}/listings?region=${encodeURIComponent(r._id)}`}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{r._id}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{r.count}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* VIP / Featured */}
        {featured.length > 0 && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                ⭐ {ka ? 'VIP განცხადებები' : 'VIP Listings'}
              </h2>
              <Link href={`/${locale}/listings`} className="text-sm text-blue-600 hover:underline">
                {ka ? 'ყველა' : 'View all'}
              </Link>
            </div>
            <ListingCarousel listings={featured} locale={locale} />
          </section>
        )}

        {/* Most popular */}
        {popular.length > 0 && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                🔥 {ka ? 'პოპულარული განცხადებები' : 'Most Popular'}
              </h2>
              <Link href={`/${locale}/listings`} className="text-sm text-blue-600 hover:underline">
                {ka ? 'ყველა' : 'View all'}
              </Link>
            </div>
            <ListingCarousel listings={popular} locale={locale} />
          </section>
        )}

        {/* For sale */}
        {forSale.length > 0 && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                🏷️ {ka ? 'იყიდება' : 'For Sale'}
              </h2>
              <Link href={`/${locale}/listings?transaction=sale`} className="text-sm text-blue-600 hover:underline">
                {ka ? 'ყველა' : 'View all'}
              </Link>
            </div>
            <ListingCarousel listings={forSale} locale={locale} />
          </section>
        )}

        {/* For rent */}
        {forRent.length > 0 && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                🔑 {ka ? 'ქირავდება' : 'For Rent'}
              </h2>
              <Link href={`/${locale}/listings?transaction=rent_monthly`} className="text-sm text-blue-600 hover:underline">
                {ka ? 'ყველა' : 'View all'}
              </Link>
            </div>
            <ListingCarousel listings={forRent} locale={locale} />
          </section>
        )}

      </div>
    </div>
  )
}
