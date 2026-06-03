'use client'

import dynamic from 'next/dynamic'

const FilterSidebar = dynamic(
  () => import('./FilterSidebar').then((m) => ({ default: m.FilterSidebar })),
  { ssr: false }
)

export function FilterSidebarWrapper({ locale }: { locale: string }) {
  return <FilterSidebar locale={locale} />
}
