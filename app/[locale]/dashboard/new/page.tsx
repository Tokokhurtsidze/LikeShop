import { ListingForm } from '@/components/dashboard/ListingForm'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function NewListingPage({ params }: PageProps) {
  const { locale } = await params
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        {locale === 'ka' ? 'განცხადების დამატება' : 'Post New Listing'}
      </h2>
      <ListingForm locale={locale} />
    </div>
  )
}
