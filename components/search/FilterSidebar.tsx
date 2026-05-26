'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { Select } from '@/components/ui/Select'

const REGIONS = [
  'Tbilisi', 'Kutaisi', 'Batumi', 'Rustavi', 'Gori', 'Zugdidi',
  'Poti', 'Telavi', 'Mtskheta', 'Akhaltsikhe', 'Kobuleti', 'Borjomi',
  'Sighnaghi', 'Other',
]

interface FilterSidebarProps {
  locale: string
}

export function FilterSidebar({ locale }: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const ka = locale === 'ka'

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  function clearAll() {
    startTransition(() => router.push(pathname))
  }

  const transactionOptions = [
    { value: '', label: ka ? 'ყველა' : 'All Types' },
    { value: 'sale', label: ka ? 'იყიდება' : 'For Sale' },
    { value: 'rent_monthly', label: ka ? 'ქირავდება თვიურად' : 'Monthly Rent' },
    { value: 'rent_daily', label: ka ? 'ქირავდება დღიურად' : 'Daily Rent' },
  ]

  const propertyOptions = [
    { value: '', label: ka ? 'ყველა' : 'All Types' },
    { value: 'apartment', label: ka ? 'ბინა' : 'Apartment' },
    { value: 'house', label: ka ? 'სახლი' : 'House' },
    { value: 'cottage', label: ka ? 'კოტეჯი' : 'Cottage' },
    { value: 'commercial', label: ka ? 'კომერციული' : 'Commercial' },
    { value: 'land', label: ka ? 'მიწა' : 'Land' },
  ]

  const regionOptions = [
    { value: '', label: ka ? 'ყველა რეგიონი' : 'All Regions' },
    ...REGIONS.map((r) => ({ value: r, label: r })),
  ]

  const roomOptions = [
    { value: '', label: ka ? 'ყველა' : 'Any' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4+' },
  ]

  return (
    <aside className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">{ka ? 'ფილტრი' : 'Filters'}</h2>
        <button
          onClick={clearAll}
          disabled={isPending}
          className="text-xs text-blue-600 hover:underline disabled:opacity-50"
        >
          {ka ? 'გასუფთავება' : 'Clear all'}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <Select
          label={ka ? 'გარიგების ტიპი' : 'Transaction Type'}
          value={searchParams.get('transaction') ?? ''}
          onChange={(e) => setParam('transaction', e.target.value)}
          options={transactionOptions}
        />

        <Select
          label={ka ? 'ქონების ტიპი' : 'Property Type'}
          value={searchParams.get('type') ?? ''}
          onChange={(e) => setParam('type', e.target.value)}
          options={propertyOptions}
        />

        <Select
          label={ka ? 'რეგიონი' : 'Region'}
          value={searchParams.get('region') ?? ''}
          onChange={(e) => setParam('region', e.target.value)}
          options={regionOptions}
        />

        <Select
          label={ka ? 'ოთახები' : 'Rooms'}
          value={searchParams.get('rooms') ?? ''}
          onChange={(e) => setParam('rooms', e.target.value)}
          options={roomOptions}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {ka ? 'ფასი (₾)' : 'Price (₾)'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder={ka ? 'მინ.' : 'Min'}
              defaultValue={searchParams.get('minPrice') ?? ''}
              onBlur={(e) => setParam('minPrice', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              placeholder={ka ? 'მაქს.' : 'Max'}
              defaultValue={searchParams.get('maxPrice') ?? ''}
              onBlur={(e) => setParam('maxPrice', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {ka ? 'ფართი (მ²)' : 'Area (m²)'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder={ka ? 'მინ.' : 'Min'}
              defaultValue={searchParams.get('minArea') ?? ''}
              onBlur={(e) => setParam('minArea', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              placeholder={ka ? 'მაქს.' : 'Max'}
              defaultValue={searchParams.get('maxArea') ?? ''}
              onBlur={(e) => setParam('maxArea', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
