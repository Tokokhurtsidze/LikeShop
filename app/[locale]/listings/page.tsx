import { Suspense } from 'react'
import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import { Listing } from '@/models/Listing'
import { buildListingQuery, getSkip, PAGE_SIZE } from '@/lib/query-builder'
import { ListingGrid } from '@/components/listings/ListingGrid'
import { FilterSidebar } from '@/components/search/FilterSidebar'
import { FilterChips } from '@/components/search/FilterChips'
import { SearchBar } from '@/components/search/SearchBar'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string>>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ka' ? 'განცხადებები — LikeShop' : 'Property Listings — LikeShop',
    description:
      locale === 'ka'
        ? 'იძებნეთ ბინები, სახლები და კომერციული ფართები საქართველოში'
        : 'Search apartments, houses and commercial properties across Georgia',
  }
}

async function getListings(searchParams: Record<string, string>) {
  try {
    await connectDB()
    const query = buildListingQuery(searchParams)
    const skip = getSkip(searchParams.page)

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(PAGE_SIZE)
        .populate('owner', 'name phone')
        .lean(),
      Listing.countDocuments(query),
    ])

    return {
      listings: JSON.parse(JSON.stringify(listings)),
      total,
      page: Math.max(1, Number(searchParams.page ?? 1)),
      totalPages: Math.ceil(total / PAGE_SIZE),
    }
  } catch {
    return { listings: [], total: 0, page: 1, totalPages: 0 }
  }
}

export default async function ListingsPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const sp = await searchParams
  const ka = locale === 'ka'

  const { listings, total, page, totalPages } = await getListings(sp)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {ka ? 'განცხადებები' : 'Property Listings'}
      </h1>

      <div className="mb-6">
        <SearchBar locale={locale} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 lg:shrink-0">
          <Suspense>
            <FilterSidebar locale={locale} />
          </Suspense>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              {ka ? `ნაპოვნია ${total} განცხადება` : `${total} properties found`}
            </p>
            <Suspense>
              <FilterChips locale={locale} />
            </Suspense>
          </div>

          <ListingGrid listings={listings} locale={locale} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/${locale}/listings?${new URLSearchParams({ ...sp, page: String(page - 1) })}`}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  {ka ? '← წინა' : '← Prev'}
                </Link>
              )}
              <span className="text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/${locale}/listings?${new URLSearchParams({ ...sp, page: String(page + 1) })}`}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  {ka ? 'შემდეგი →' : 'Next →'}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
