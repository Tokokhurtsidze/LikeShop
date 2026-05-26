import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import { Listing } from '@/models/Listing'
import { ListingGrid } from '@/components/listings/ListingGrid'
import { SearchBar } from '@/components/search/SearchBar'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ locale: string }>
}

async function getFeaturedListings() {
  try {
    await connectDB()
    const listings = await Listing.find({ status: 'active', featured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean()
    return JSON.parse(JSON.stringify(listings))
  } catch {
    return []
  }
}

async function getRecentListings() {
  try {
    await connectDB()
    const listings = await Listing.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(9)
      .lean()
    return JSON.parse(JSON.stringify(listings))
  } catch {
    return []
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const ka = locale === 'ka'

  const [featured, recent] = await Promise.all([getFeaturedListings(), getRecentListings()])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 px-4 py-20 text-white sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl">
            {ka
              ? 'იპოვე შენი იდეალური უძრავი ქონება საქართველოში'
              : 'Find Your Perfect Property in Georgia'}
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
              { label: ka ? 'იყიდება' : 'For Sale', tx: 'sale', type: '' },
              { label: ka ? 'ქირავდება' : 'For Rent', tx: 'rent_monthly', type: '' },
              { label: ka ? 'ბინა' : 'Apartments', tx: '', type: 'apartment' },
              { label: ka ? 'სახლი' : 'Houses', tx: '', type: 'house' },
            ].map((pill) => (
              <Link
                key={pill.label}
                href={`/${locale}/listings?${pill.tx ? `transaction=${pill.tx}` : `type=${pill.type}`}`}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm hover:bg-white/20"
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
          <span>🏠 {ka ? '10,000+ განცხადება' : '10,000+ Listings'}</span>
          <span>📍 {ka ? 'საქართველოს ყველა რეგიონი' : 'All Regions of Georgia'}</span>
          <span>✅ {ka ? 'გადამოწმებული განცხადებები' : 'Verified Listings'}</span>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Featured */}
        {featured.length > 0 && (
          <section className="mb-14">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {ka ? '⭐ გამორჩეული განცხადებები' : '⭐ Featured Properties'}
              </h2>
              <Link href={`/${locale}/listings`} className="text-sm text-blue-600 hover:underline">
                {ka ? 'ყველა ნახვა' : 'View all'}
              </Link>
            </div>
            <ListingGrid listings={featured} locale={locale} />
          </section>
        )}

        {/* Recent */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {ka ? '🆕 ბოლო განცხადებები' : '🆕 Latest Listings'}
            </h2>
            <Link href={`/${locale}/listings`} className="text-sm text-blue-600 hover:underline">
              {ka ? 'ყველა ნახვა' : 'View all'}
            </Link>
          </div>
          <ListingGrid listings={recent} locale={locale} />
        </section>
      </div>
    </div>
  )
}
