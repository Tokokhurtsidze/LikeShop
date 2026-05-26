'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Listing } from '@/models/Listing'
import { User } from '@/models/User'
import { cloudinary } from '@/lib/cloudinary'
import { createListingSchema, updateListingSchema, type CreateListingInput, type UpdateListingInput } from '@/lib/validations/listing'

export async function createListing(
  input: CreateListingInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  const parsed = createListingSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  await connectDB()

  const listing = await Listing.create({ ...parsed.data, owner: session.user.id })
  await User.findByIdAndUpdate(session.user.id, { $push: { listings: listing._id } })

  revalidatePath('/listings')
  revalidatePath('/dashboard')

  return { success: true, id: listing._id.toString() }
}

export async function updateListing(
  id: string,
  input: UpdateListingInput
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  const parsed = updateListingSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  await connectDB()

  const listing = await Listing.findById(id)
  if (!listing) return { success: false, error: 'Listing not found' }
  if (listing.owner.toString() !== session.user.id) return { success: false, error: 'Forbidden' }

  await Listing.findByIdAndUpdate(id, parsed.data)
  revalidatePath(`/listings/${id}`)
  revalidatePath('/dashboard')

  return { success: true }
}

export async function deleteListing(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  await connectDB()

  const listing = await Listing.findById(id)
  if (!listing) return { success: false, error: 'Listing not found' }
  if (listing.owner.toString() !== session.user.id) return { success: false, error: 'Forbidden' }

  // Delete images from Cloudinary
  const deletePromises = listing.images.map((img) =>
    cloudinary.uploader.destroy(img.publicId).catch(() => null)
  )
  await Promise.all(deletePromises)

  await Listing.findByIdAndDelete(id)
  await User.findByIdAndUpdate(session.user.id, { $pull: { listings: listing._id } })

  revalidatePath('/listings')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function incrementViews(id: string): Promise<void> {
  await connectDB()
  await Listing.findByIdAndUpdate(id, { $inc: { views: 1 } })
}
