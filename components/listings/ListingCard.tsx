import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'

type ListingImage = { publicId: string; url: string; alt: string }
type LocalizedString = { en: string; ka: string }

interface ListingCardProps {
  listing: {
    _id: string
    title: LocalizedString
    transactionType: 'sale' | 'rent_monthly' | 'rent_daily'
    propertyType: string
    price: number
    currency?: string
    area: number
    rooms: number
    floor?: number
    location: { region: string; district: string }
    images: ListingImage[]
    featured?: boolean
    createdAt: string | Date
  }
  locale: string
}

const transactionLabels: Record<string, Record<string, string>> = {
  sale: { en: 'For Sale', ka: 'იყიდება' },
  rent_monthly: { en: 'Monthly Rent', ka: 'ქირავდება' },
  rent_daily: { en: 'Daily Rent', ka: 'დღ. ქირა' },
}

export function ListingCard({ listing, locale }: ListingCardProps) {
  const title = listing.title[locale as 'en' | 'ka'] || listing.title.en
  const coverImage = listing.images[0]
  const txLabel = transactionLabels[listing.transactionType]?.[locale] ?? transactionLabels[listing.transactionType]?.en
  const priceFormatted = listing.price.toLocaleString()

  return (
    <Link
      href={`/${locale}/listings/${listing._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alt || title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <Badge variant={listing.transactionType}>{txLabel}</Badge>
          {listing.featured && <Badge variant="featured">VIP</Badge>}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-gray-900">₾{priceFormatted}</span>
          {listing.transactionType === 'rent_monthly' && (
            <span className="text-sm text-gray-500">{locale === 'ka' ? '/თვეში' : '/mo'}</span>
          )}
          {listing.transactionType === 'rent_daily' && (
            <span className="text-sm text-gray-500">{locale === 'ka' ? '/დღეში' : '/day'}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-medium text-gray-800 group-hover:text-blue-600">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{listing.location.district}, {listing.location.region}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 border-t border-gray-100 pt-2 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {listing.rooms} {locale === 'ka' ? 'ოთ.' : 'rooms'}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
            </svg>
            {listing.area} {locale === 'ka' ? 'მ²' : 'm²'}
          </span>
          {listing.floor != null && (
            <span>{listing.floor}{locale === 'ka' ? '-ე სარ.' : 'F'}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
