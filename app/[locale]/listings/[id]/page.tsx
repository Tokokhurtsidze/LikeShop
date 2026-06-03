import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import { Listing } from '@/models/Listing'
import { ImageGallery } from '@/components/listings/ImageGallery'
import { ListingJsonLd } from '@/components/listings/ListingJsonLd'
import { Badge } from '@/components/ui/Badge'
import { incrementViews } from '@/actions/listings'

interface PageProps {
  params: Promise<{ locale: string; id: string }>
}

async function getListing(id: string) {
  await connectDB()
  try {
    const listing = await Listing.findById(id).populate('owner', 'name phone avatar').lean()
    return listing ? JSON.parse(JSON.stringify(listing)) : null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params
  const listing = await getListing(id)
  if (!listing) return { title: 'Not Found' }

  const title = listing.title[locale as 'en' | 'ka'] || listing.title.en
  const description = listing.description[locale as 'en' | 'ka'] || listing.description.en
  const image = listing.images[0]?.url

  return {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title,
      description: description.slice(0, 160),
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
      type: 'website',
      locale: locale === 'ka' ? 'ka_GE' : 'en_US',
    },
    alternates: {
      canonical: `/${locale}/listings/${id}`,
    },
  }
}

const txLabels: Record<string, { en: string; ka: string }> = {
  sale: { en: 'For Sale', ka: 'იყიდება' },
  rent_monthly: { en: 'Monthly Rent', ka: 'ქირავდება თვიურად' },
  rent_daily: { en: 'Daily Rent', ka: 'ქირავდება დღიურად' },
}

const propLabels: Record<string, { en: string; ka: string }> = {
  house: { en: 'House', ka: 'სახლი' },
  apartment: { en: 'Apartment', ka: 'ბინა' },
  cottage: { en: 'Cottage', ka: 'კოტეჯი' },
  commercial: { en: 'Commercial', ka: 'კომერციული' },
  land: { en: 'Land', ka: 'მიწა' },
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { locale, id } = await params
  const listing = await getListing(id)
  if (!listing) notFound()

  // Increment view count in background
  incrementViews(id).catch(() => null)

  const ka = locale === 'ka'
  const l = locale as 'en' | 'ka'
  const title = listing.title[l] || listing.title.en
  const description = listing.description[l] || listing.description.en
  const currencySymbol = listing.currency === 'GEL' ? '₾' : '$'
  const owner = listing.owner as { name: string; phone?: string; avatar?: string } | null

  const pageUrl = `${process.env.NEXTAUTH_URL ?? ''}/${locale}/listings/${id}`

  return (
    <>
      <ListingJsonLd listing={listing} url={pageUrl} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main column */}
          <div className="lg:col-span-2">
            <ImageGallery images={listing.images} title={title} />

            <div className="mt-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge variant={listing.transactionType}>
                      {txLabels[listing.transactionType as string]?.[l]}
                    </Badge>
                    <Badge variant="active">
                      {propLabels[listing.propertyType as string]?.[l]}
                    </Badge>
                    {listing.featured && <Badge variant="featured">VIP</Badge>}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    {listing.location.district}, {listing.location.region}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-700">
                    {currencySymbol}{listing.price.toLocaleString()}
                  </p>
                  {listing.transactionType === 'rent_monthly' && (
                    <p className="text-sm text-gray-500">{ka ? 'თვეში' : 'per month'}</p>
                  )}
                  {listing.transactionType === 'rent_daily' && (
                    <p className="text-sm text-gray-500">{ka ? 'დღეში' : 'per day'}</p>
                  )}
                </div>
              </div>

              {/* Stats grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: ka ? 'ოთახები' : 'Rooms', value: listing.rooms },
                  { label: ka ? 'საძინებელი' : 'Bedrooms', value: listing.bedrooms },
                  { label: ka ? 'სააბაზანო' : 'Bathrooms', value: listing.bathrooms },
                  {
                    label: ka ? 'ფართი' : 'Area',
                    value: `${listing.area} ${ka ? 'მ²' : 'm²'}`,
                  },
                  ...(listing.floor != null
                    ? [
                        {
                          label: ka ? 'სართული' : 'Floor',
                          value: `${listing.floor}${listing.totalFloors ? `/${listing.totalFloors}` : ''}`,
                        },
                      ]
                    : []),
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-gray-50 p-3 text-center">
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="mt-0.5 text-lg font-semibold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  {ka ? 'აღწერა' : 'Description'}
                </h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {description}
                </p>
              </div>

              {/* Amenities */}
              {listing.amenities?.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 text-lg font-semibold text-gray-900">
                    {ka ? 'კეთილმოწყობა' : 'Amenities'}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(listing.amenities as string[]).map((a) => (
                      <span
                        key={a}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Sidebar — contact + meta */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-4">
              {/* Contact card */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 font-semibold text-gray-900">
                  {ka ? 'გამყიდველი' : 'Seller'}
                </h2>
                {owner ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                        {owner.name?.charAt(0).toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{owner.name}</p>
                        {owner.phone && <p className="text-sm text-gray-500">{owner.phone}</p>}
                      </div>
                    </div>
                    {owner.phone && (
                      <a
                        href={`tel:${owner.phone}`}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {ka ? 'დაკავშირება' : 'Call Now'}
                      </a>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">{ka ? 'ინფორმაცია არ არის' : 'No contact info'}</p>
                )}
              </div>

              {/* Listing meta */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-sm text-gray-600">
                <div className="flex justify-between border-b border-gray-100 py-2">
                  <span>ID</span>
                  <span className="font-mono text-xs">{String(listing._id).slice(-8)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-2">
                  <span>{ka ? 'გამოქვეყნდა' : 'Posted'}</span>
                  <span>
                    {new Date(listing.createdAt).toLocaleDateString(
                      locale === 'ka' ? 'ka-GE' : 'en-US'
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span>{ka ? 'ნახვა' : 'Views'}</span>
                  <span>{listing.views ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
