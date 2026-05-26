'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useState } from 'react'
import { Button } from '@/components/ui/Button'

interface SearchBarProps {
  locale: string
  placeholder?: string
}

export function SearchBar({ locale, placeholder }: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(searchParams.get('q') ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    params.delete('page')
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? (locale === 'ka' ? 'მოძებნე...' : 'Search...')}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
      <Button type="submit" isLoading={isPending} size="md">
        {locale === 'ka' ? 'ძიება' : 'Search'}
      </Button>
    </form>
  )
}
