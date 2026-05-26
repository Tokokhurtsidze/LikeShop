import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Listing } from '@/models/Listing'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { DeleteListingButton } from '@/components/dashboard/DeleteListingButton'

interface PageProps {
  params: Promise<{ locale: string }>
}

async function getUserListings(userId: string) {
  await connectDB()
  const listings = await Listing.find({ owner: userId }).sort({ createdAt: -1 }).lean()
  return JSON.parse(JSON.stringify(listings))
}

export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params
  const session = await auth()
  if (!session?.user?.id) redirect(`/${locale}/auth/login`)

  const listings = await getUserListings(session.user.id)
  const ka = locale === 'ka'

  if (!listings.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 text-6xl">🏠</div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          {ka ? 'განცხადება ჯერ არ დამატებია' : 'No listings yet'}
        </h2>
        <p className="mb-6 text-gray-500">
          {ka ? 'დაამატეთ თქვენი პირველი განცხადება' : 'Post your first property listing'}
        </p>
        <Link
          href={`/${locale}/dashboard/new`}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          {ka ? 'განცხადების დამატება' : 'Create Listing'}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {listings.map((listing: any) => (
        <div
          key={listing._id}
          className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-36">
            {listing.images?.[0] ? (
              <Image
                src={listing.images[0].url}
                alt={listing.title[locale] || listing.title.en}
                fill
                className="object-cover"
                sizes="144px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
            <div>
              <Link
                href={`/${locale}/listings/${listing._id}`}
                className="line-clamp-1 font-semibold text-gray-900 hover:text-blue-600"
              >
                {listing.title[locale] || listing.title.en}
              </Link>
              <p className="text-sm text-gray-500">
                {listing.location.district}, {listing.location.region}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={listing.status as 'active' | 'inactive' | 'sold'}>
                {listing.status === 'active'
                  ? ka
                    ? 'აქტიური'
                    : 'Active'
                  : listing.status === 'inactive'
                  ? ka
                    ? 'არააქტიური'
                    : 'Inactive'
                  : ka
                  ? 'გაყიდული'
                  : 'Sold'}
              </Badge>
              <span className="text-sm font-semibold text-blue-700">
                {listing.currency === 'GEL' ? '₾' : '$'}
                {listing.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400">
                {listing.views ?? 0} {ka ? 'ნახვა' : 'views'}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <Link
              href={`/${locale}/dashboard/edit/${listing._id}`}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              {ka ? 'რედ.' : 'Edit'}
            </Link>
            <DeleteListingButton id={listing._id} locale={locale} />
          </div>
        </div>
      ))}
    </div>
  )
}
