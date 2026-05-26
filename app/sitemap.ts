import type { MetadataRoute } from 'next'
import { connectDB } from '@/lib/mongodb'
import { Listing } from '@/models/Listing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://likeshop.ge'

  await connectDB()
  const listings = await Listing.find({ status: 'active' }, { _id: 1, updatedAt: 1 }).lean()

  const listingUrls: MetadataRoute.Sitemap = listings.flatMap((l) => [
    {
      url: `${baseUrl}/ka/listings/${l._id}`,
      lastModified: l.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/listings/${l._id}`,
      lastModified: l.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ])

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/ka`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/en`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/ka/listings`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/en/listings`, changeFrequency: 'hourly', priority: 0.9 },
  ]

  return [...staticUrls, ...listingUrls]
}
