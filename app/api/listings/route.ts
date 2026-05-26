import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Listing } from '@/models/Listing'
import { buildListingQuery, getSkip, PAGE_SIZE, type ListingFilters } from '@/lib/query-builder'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const filters: ListingFilters = {
      transaction: searchParams.get('transaction') ?? undefined,
      type: searchParams.get('type') ?? undefined,
      region: searchParams.get('region') ?? undefined,
      minPrice: searchParams.get('minPrice') ?? undefined,
      maxPrice: searchParams.get('maxPrice') ?? undefined,
      rooms: searchParams.get('rooms') ?? undefined,
      minArea: searchParams.get('minArea') ?? undefined,
      maxArea: searchParams.get('maxArea') ?? undefined,
      q: searchParams.get('q') ?? undefined,
      page: searchParams.get('page') ?? undefined,
    }

    await connectDB()

    const query = buildListingQuery(filters)
    const skip = getSkip(filters.page)

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(PAGE_SIZE)
        .populate('owner', 'name phone avatar')
        .lean(),
      Listing.countDocuments(query),
    ])

    return NextResponse.json({
      listings,
      total,
      page: Math.max(1, Number(filters.page ?? 1)),
      totalPages: Math.ceil(total / PAGE_SIZE),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}
