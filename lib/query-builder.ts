export interface ListingFilters {
  transaction?: string
  type?: string
  region?: string
  minPrice?: string
  maxPrice?: string
  rooms?: string
  minArea?: string
  maxArea?: string
  q?: string
  page?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MongoQuery = Record<string, any>

export function buildListingQuery(filters: ListingFilters): MongoQuery {
  const query: MongoQuery = { status: 'active' }

  if (filters.transaction) query.transactionType = filters.transaction
  if (filters.type) query.propertyType = filters.type
  if (filters.region) query['location.region'] = filters.region

  if (filters.minPrice || filters.maxPrice) {
    query.price = {}
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice)
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice)
  }

  if (filters.rooms) {
    const r = Number(filters.rooms)
    query.rooms = r >= 4 ? { $gte: 4 } : r
  }

  if (filters.minArea || filters.maxArea) {
    query.area = {}
    if (filters.minArea) query.area.$gte = Number(filters.minArea)
    if (filters.maxArea) query.area.$lte = Number(filters.maxArea)
  }

  if (filters.q) query.$text = { $search: filters.q }

  return query
}

export const PAGE_SIZE = 20

export function getSkip(page?: string): number {
  const p = Math.max(1, Number(page ?? 1))
  return (p - 1) * PAGE_SIZE
}
