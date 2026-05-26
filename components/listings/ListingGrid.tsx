import { ListingCard } from './ListingCard'
import { ListingCardSkeleton } from './ListingCardSkeleton'

interface Listing {
  _id: string
  title: { en: string; ka: string }
  transactionType: 'sale' | 'rent_monthly' | 'rent_daily'
  propertyType: string
  price: number
  currency: 'GEL' | 'USD'
  area: number
  rooms: number
  floor?: number
  location: { region: string; district: string }
  images: { publicId: string; url: string; alt: string }[]
  featured?: boolean
  createdAt: string | Date
}

interface ListingGridProps {
  listings: Listing[]
  locale: string
  isLoading?: boolean
}

export function ListingGrid({ listings, locale, isLoading }: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!listings.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <p className="text-gray-500">{locale === 'ka' ? 'განცხადება ვერ მოიძებნა' : 'No listings found'}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing._id} listing={listing} locale={locale} />
      ))}
    </div>
  )
}
