'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

interface FilterChipsProps {
  locale: string
}

const LABELS: Record<string, Record<string, string>> = {
  transaction: {
    sale: 'For Sale / იყიდება',
    rent_monthly: 'Monthly Rent / ქირა',
    rent_daily: 'Daily Rent / დღ. ქირა',
  },
  type: {
    apartment: 'Apartment / ბინა',
    house: 'House / სახლი',
    cottage: 'Cottage / კოტეჯი',
    commercial: 'Commercial / კომერც.',
    land: 'Land / მიწა',
  },
}

export function FilterChips({ locale: _locale }: FilterChipsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const chips: { key: string; label: string }[] = []

  const transaction = searchParams.get('transaction')
  const type = searchParams.get('type')
  const region = searchParams.get('region')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const q = searchParams.get('q')

  if (transaction) chips.push({ key: 'transaction', label: LABELS.transaction[transaction] ?? transaction })
  if (type) chips.push({ key: 'type', label: LABELS.type[type] ?? type })
  if (region) chips.push({ key: 'region', label: region })
  if (minPrice || maxPrice) chips.push({ key: '__price', label: `${minPrice ?? '0'} — ${maxPrice ?? '∞'} ₾` })
  if (q) chips.push({ key: 'q', label: `"${q}"` })

  if (!chips.length) return null

  function removeChip(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (key === '__price') {
      params.delete('minPrice')
      params.delete('maxPrice')
    } else {
      params.delete(key)
    }
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
        >
          {chip.label}
          <button
            onClick={() => removeChip(chip.key)}
            className="ml-1 rounded-full p-0.5 hover:bg-blue-100"
            aria-label={`Remove ${chip.label} filter`}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
    </div>
  )
}
