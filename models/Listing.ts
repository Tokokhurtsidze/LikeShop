import mongoose, { Schema, type Document, type Model } from 'mongoose'

export type TransactionType = 'sale' | 'rent_monthly' | 'rent_daily'
export type PropertyType = 'house' | 'apartment' | 'cottage' | 'commercial' | 'land'
export type ListingStatus = 'active' | 'inactive' | 'sold'
export type Currency = 'GEL' | 'USD'

export interface IListing extends Document {
  title: { en: string; ka: string }
  description: { en: string; ka: string }
  transactionType: TransactionType
  propertyType: PropertyType
  status: ListingStatus
  price: number
  currency: Currency
  area: number
  rooms: number
  bedrooms: number
  bathrooms: number
  floor?: number
  totalFloors?: number
  location: {
    region: string
    district: string
    address: string
    coordinates: { lat: number; lng: number }
  }
  amenities: string[]
  images: Array<{ publicId: string; url: string; alt: string }>
  owner: mongoose.Types.ObjectId
  views: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const ListingSchema = new Schema<IListing>(
  {
    title: {
      en: { type: String, required: true, trim: true },
      ka: { type: String, required: true, trim: true },
    },
    description: {
      en: { type: String, required: true },
      ka: { type: String, required: true },
    },
    transactionType: {
      type: String,
      enum: ['sale', 'rent_monthly', 'rent_daily'],
      required: true,
    },
    propertyType: {
      type: String,
      enum: ['house', 'apartment', 'cottage', 'commercial', 'land'],
      required: true,
    },
    status: { type: String, enum: ['active', 'inactive', 'sold'], default: 'active' },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['GEL', 'USD'], default: 'GEL' },
    area: { type: Number, required: true, min: 1 },
    rooms: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    floor: { type: Number },
    totalFloors: { type: Number },
    location: {
      region: { type: String, required: true },
      district: { type: String, required: true },
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    amenities: [{ type: String }],
    images: [
      {
        publicId: { type: String, required: true },
        url: { type: String, required: true },
        alt: { type: String, default: '' },
      },
    ],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

ListingSchema.index({ transactionType: 1, propertyType: 1, status: 1 })
ListingSchema.index({ 'location.region': 1 })
ListingSchema.index({ price: 1 })
ListingSchema.index({ owner: 1 })
ListingSchema.index({ createdAt: -1 })
ListingSchema.index(
  { 'title.en': 'text', 'title.ka': 'text', 'location.address': 'text', 'location.district': 'text' },
  { name: 'listing_text_index' }
)

export const Listing: Model<IListing> =
  mongoose.models.Listing ?? mongoose.model<IListing>('Listing', ListingSchema)
