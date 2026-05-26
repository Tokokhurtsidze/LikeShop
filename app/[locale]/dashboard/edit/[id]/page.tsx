import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Listing } from '@/models/Listing'
import { ListingForm } from '@/components/dashboard/ListingForm'

interface PageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditListingPage({ params }: PageProps) {
  const { locale, id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect(`/${locale}/auth/login`)

  await connectDB()
  const listing = await Listing.findById(id).lean()
  if (!listing) notFound()
  if (String(listing.owner) !== session.user.id) redirect(`/${locale}/dashboard`)

  const initialData = JSON.parse(JSON.stringify(listing))

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        {locale === 'ka' ? 'განცხადების რედაქტირება' : 'Edit Listing'}
      </h2>
      <ListingForm locale={locale} initialData={initialData} />
    </div>
  )
}
