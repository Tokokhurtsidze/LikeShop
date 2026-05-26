'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { createListingSchema, type CreateListingInput } from '@/lib/validations/listing'
import { createListing, updateListing } from '@/actions/listings'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyResolver = any
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { ImageUploader } from '@/components/dashboard/ImageUploader'

const REGIONS = [
  'Tbilisi',
  'Kutaisi',
  'Batumi',
  'Rustavi',
  'Gori',
  'Zugdidi',
  'Poti',
  'Telavi',
  'Mtskheta',
  'Akhaltsikhe',
  'Kobuleti',
  'Borjomi',
  'Sighnaghi',
  'Other',
]

const AMENITIES = [
  'parking',
  'elevator',
  'balcony',
  'terrace',
  'garden',
  'pool',
  'gym',
  'security',
  'air_conditioning',
  'heating',
  'internet',
  'furniture',
  'appliances',
  'storage',
  'fireplace',
]

const AMENITY_LABELS: Record<string, { en: string; ka: string }> = {
  parking: { en: 'Parking', ka: 'პარკინგი' },
  elevator: { en: 'Elevator', ka: 'ლიფტი' },
  balcony: { en: 'Balcony', ka: 'აივანი' },
  terrace: { en: 'Terrace', ka: 'ტერასა' },
  garden: { en: 'Garden', ka: 'ეზო' },
  pool: { en: 'Pool', ka: 'აუზი' },
  gym: { en: 'Gym', ka: 'სპ. დარბაზი' },
  security: { en: '24h Security', ka: 'დაცვა' },
  air_conditioning: { en: 'AC', ka: 'კონდ.' },
  heating: { en: 'Heating', ka: 'გათბობა' },
  internet: { en: 'Internet', ka: 'ინტერნეტი' },
  furniture: { en: 'Furnished', ka: 'მებლირებ.' },
  appliances: { en: 'Appliances', ka: 'ტექნიკა' },
  storage: { en: 'Storage', ka: 'სასაწყობე' },
  fireplace: { en: 'Fireplace', ka: 'ბუხარი' },
}

interface ListingFormProps {
  locale: string
  initialData?: Partial<CreateListingInput> & { _id?: string }
}

export function ListingForm({ locale, initialData }: ListingFormProps) {
  const router = useRouter()
  const ka = locale === 'ka'
  const [serverError, setServerError] = useState('')
  const isEdit = !!initialData?._id

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateListingInput>({
    resolver: zodResolver(createListingSchema) as AnyResolver,
    defaultValues: initialData ?? {
      title: { en: '', ka: '' },
      description: { en: '', ka: '' },
      transactionType: 'sale',
      propertyType: 'apartment',
      price: 0,
      currency: 'GEL',
      area: 0,
      rooms: 1,
      bedrooms: 1,
      bathrooms: 1,
      location: {
        region: 'Tbilisi',
        district: '',
        address: '',
        coordinates: { lat: 41.6941, lng: 44.8337 },
      },
      amenities: [],
      images: [],
    },
  })

  const selectedAmenities = watch('amenities') ?? []

  function toggleAmenity(key: string) {
    const current = watch('amenities') ?? []
    if (current.includes(key)) {
      setValue('amenities', current.filter((a) => a !== key))
    } else {
      setValue('amenities', [...current, key])
    }
  }

  async function onSubmit(data: CreateListingInput) {
    setServerError('')
    const result = isEdit
      ? await updateListing(initialData!._id!, data)
      : await createListing(data)

    if (!result.success) {
      setServerError(result.error ?? 'Something went wrong')
      return
    }

    router.push(`/${locale}/dashboard`)
    router.refresh()
  }

  const sectionClass = 'rounded-xl border border-gray-200 bg-white p-6 shadow-sm'
  const sectionTitle = 'mb-4 text-base font-semibold text-gray-900'

  const txOptions = [
    { value: 'sale', label: ka ? 'იყიდება' : 'For Sale' },
    { value: 'rent_monthly', label: ka ? 'ქირავდება თვიურად' : 'Monthly Rent' },
    { value: 'rent_daily', label: ka ? 'ქირავდება დღიურად' : 'Daily Rent' },
  ]
  const propOptions = [
    { value: 'apartment', label: ka ? 'ბინა' : 'Apartment' },
    { value: 'house', label: ka ? 'სახლი' : 'House' },
    { value: 'cottage', label: ka ? 'კოტეჯი' : 'Cottage' },
    { value: 'commercial', label: ka ? 'კომერციული' : 'Commercial' },
    { value: 'land', label: ka ? 'მიწა' : 'Land' },
  ]
  const currencyOptions = [
    { value: 'GEL', label: '₾ GEL' },
    { value: 'USD', label: '$ USD' },
  ]
  const regionOptions = REGIONS.map((r) => ({ value: r, label: r }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Photos */}
      <div className={sectionClass}>
        <h2 className={sectionTitle}>{ka ? 'ფოტოსურათები' : 'Photos'}</h2>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ImageUploader value={field.value} onChange={field.onChange} locale={locale} />
          )}
        />
        {errors.images && (
          <p className="mt-2 text-xs text-red-600">{errors.images.message}</p>
        )}
      </div>

      {/* Basic info */}
      <div className={sectionClass}>
        <h2 className={sectionTitle}>{ka ? 'ძირითადი ინფორმაცია' : 'Basic Information'}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="transactionType"
            control={control}
            render={({ field }) => (
              <Select
                label={ka ? 'გარიგების ტიპი' : 'Transaction Type'}
                options={txOptions}
                {...field}
              />
            )}
          />
          <Controller
            name="propertyType"
            control={control}
            render={({ field }) => (
              <Select
                label={ka ? 'ქონების ტიპი' : 'Property Type'}
                options={propOptions}
                {...field}
              />
            )}
          />
          <Input
            label={ka ? 'სათაური (ინგლისურად)' : 'Title (English)'}
            placeholder="Modern apartment in Vake"
            error={errors.title?.en?.message}
            {...register('title.en')}
          />
          <Input
            label={ka ? 'სათაური (ქართულად)' : 'Title (Georgian)'}
            placeholder="თანამედროვე ბინა ვაკეში"
            error={errors.title?.ka?.message}
            {...register('title.ka')}
          />
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {ka ? 'აღწერა (ინგლისურად)' : 'Description (English)'}
            </label>
            <textarea
              rows={4}
              placeholder="Describe the property..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              {...register('description.en')}
            />
            {errors.description?.en && (
              <p className="text-xs text-red-600">{errors.description.en.message}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {ka ? 'აღწერა (ქართულად)' : 'Description (Georgian)'}
            </label>
            <textarea
              rows={4}
              placeholder="დეტალური აღწერა..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              {...register('description.ka')}
            />
            {errors.description?.ka && (
              <p className="text-xs text-red-600">{errors.description.ka.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Price & Details */}
      <div className={sectionClass}>
        <h2 className={sectionTitle}>{ka ? 'ფასი და სპეციფიკაცია' : 'Price & Specifications'}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Input
            label={ka ? 'ფასი' : 'Price'}
            type="number"
            min={0}
            error={errors.price?.message}
            {...register('price', { valueAsNumber: true })}
          />
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select label={ka ? 'ვალუტა' : 'Currency'} options={currencyOptions} {...field} />
            )}
          />
          <Input
            label={ka ? 'ფართი (მ²)' : 'Area (m²)'}
            type="number"
            min={1}
            error={errors.area?.message}
            {...register('area', { valueAsNumber: true })}
          />
          <Input
            label={ka ? 'ოთახები' : 'Rooms'}
            type="number"
            min={1}
            error={errors.rooms?.message}
            {...register('rooms', { valueAsNumber: true })}
          />
          <Input
            label={ka ? 'საძინებელი' : 'Bedrooms'}
            type="number"
            min={0}
            error={errors.bedrooms?.message}
            {...register('bedrooms', { valueAsNumber: true })}
          />
          <Input
            label={ka ? 'სააბაზანო' : 'Bathrooms'}
            type="number"
            min={0}
            error={errors.bathrooms?.message}
            {...register('bathrooms', { valueAsNumber: true })}
          />
          <Input
            label={ka ? 'სართული' : 'Floor'}
            type="number"
            min={0}
            {...register('floor', { valueAsNumber: true })}
          />
          <Input
            label={ka ? 'სართ. რ-ბა' : 'Total Floors'}
            type="number"
            min={1}
            {...register('totalFloors', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Location */}
      <div className={sectionClass}>
        <h2 className={sectionTitle}>{ka ? 'მდებარეობა' : 'Location'}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="location.region"
            control={control}
            render={({ field }) => (
              <Select label={ka ? 'რეგიონი' : 'Region'} options={regionOptions} {...field} />
            )}
          />
          <Input
            label={ka ? 'უბანი' : 'District'}
            placeholder={ka ? 'ვაკე' : 'Vake'}
            error={errors.location?.district?.message}
            {...register('location.district')}
          />
          <div className="sm:col-span-2">
            <Input
              label={ka ? 'მისამართი' : 'Address'}
              placeholder={ka ? 'ჭავჭავაძის გამზ. 1' : 'Chavchavadze Ave 1'}
              error={errors.location?.address?.message}
              {...register('location.address')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:col-span-2">
            <Input
              label={ka ? 'განედი (lat)' : 'Latitude'}
              type="number"
              step="any"
              placeholder="41.6941"
              {...register('location.coordinates.lat', { valueAsNumber: true })}
            />
            <Input
              label={ka ? 'გრძედი (lng)' : 'Longitude'}
              type="number"
              step="any"
              placeholder="44.8337"
              {...register('location.coordinates.lng', { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className={sectionClass}>
        <h2 className={sectionTitle}>{ka ? 'კეთილმოწყობა' : 'Amenities'}</h2>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleAmenity(key)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                selectedAmenities.includes(key)
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {AMENITY_LABELS[key]?.[ka ? 'ka' : 'en'] ?? key}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          {ka ? 'გაუქმება' : 'Cancel'}
        </Button>
        <Button type="submit" isLoading={isSubmitting} size="lg">
          {isEdit
            ? ka
              ? 'შენახვა'
              : 'Save Changes'
            : ka
            ? 'გამოქვეყნება'
            : 'Post Listing'}
        </Button>
      </div>
    </form>
  )
}
