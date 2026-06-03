'use client'

import { useRef, useState, useEffect } from 'react'
import { ListingCard } from './ListingCard'

interface Listing {
  _id: string
  title: { en: string; ka: string }
  transactionType: 'sale' | 'rent_monthly' | 'rent_daily'
  propertyType: string
  price: number
  currency?: string
  area: number
  rooms: number
  floor?: number
  location: { region: string; district: string }
  images: { publicId: string; url: string; alt: string }[]
  featured?: boolean
  createdAt: string | Date
}

interface ListingCarouselProps {
  listings: Listing[]
  locale: string
}

export function ListingCarousel({ listings, locale }: ListingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  function updateButtons() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateButtons()
    el.addEventListener('scroll', updateButtons, { passive: true })
    window.addEventListener('resize', updateButtons)
    return () => {
      el.removeEventListener('scroll', updateButtons)
      window.removeEventListener('resize', updateButtons)
    }
  }, [listings])

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector('a')?.offsetWidth ?? 280
    el.scrollBy({ left: dir === 'left' ? -(cardWidth + 20) : cardWidth + 20, behavior: 'smooth' })
  }

  if (!listings.length) return null

  return (
    <div className="relative">
      {/* Left arrow */}
      {canLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-50 sm:-left-5"
          aria-label="Scroll left"
        >
          <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="w-[260px] shrink-0 sm:w-[280px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ListingCard listing={listing} locale={locale} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      {canRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-50 sm:-right-5"
          aria-label="Scroll right"
        >
          <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}
