import { z } from 'zod'

const imageSchema = z.object({
  publicId: z.string().min(1),
  url: z.string().url(),
  alt: z.string().default(''),
})

const locationSchema = z.object({
  region: z.string().min(1, 'Region required'),
  district: z.string().min(1, 'District required'),
  address: z.string().min(1, 'Address required'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
})

export const createListingSchema = z.object({
  title: z.object({
    en: z.string().min(3, 'English title required'),
    ka: z.string().min(3, 'Georgian title required'),
  }),
  description: z.object({
    en: z.string().min(10, 'English description required'),
    ka: z.string().min(10, 'Georgian description required'),
  }),
  transactionType: z.enum(['sale', 'rent_monthly', 'rent_daily']),
  propertyType: z.enum(['house', 'apartment', 'cottage', 'commercial', 'land']),
  price: z.number().positive('Price must be positive'),
  currency: z.enum(['GEL', 'USD']).default('GEL'),
  area: z.number().min(1, 'Area must be at least 1 m²'),
  rooms: z.number().min(1),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  floor: z.number().optional(),
  totalFloors: z.number().optional(),
  location: locationSchema,
  amenities: z.array(z.string()).default([]),
  images: z.array(imageSchema).min(1, 'At least one image required').max(10, 'Maximum 10 images'),
})

export const updateListingSchema = createListingSchema.partial().extend({
  status: z.enum(['active', 'inactive', 'sold']).optional(),
})

export type CreateListingInput = z.infer<typeof createListingSchema>
export type UpdateListingInput = z.infer<typeof updateListingSchema>
