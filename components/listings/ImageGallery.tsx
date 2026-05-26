'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GalleryImage {
  publicId: string
  url: string
  alt: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!images.length) return null

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-xl bg-gray-100"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].alt || title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
        />
        <div className="absolute bottom-3 right-3 rounded-lg bg-black/50 px-2 py-1 text-xs text-white">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.publicId}
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === activeIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `Photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].alt || title}
              width={1200}
              height={800}
              className="max-h-[80vh] w-full object-contain"
            />
            <button
              className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {activeIndex > 0 && (
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70"
                onClick={() => setActiveIndex((i) => i - 1)}
                aria-label="Previous image"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {activeIndex < images.length - 1 && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70"
                onClick={() => setActiveIndex((i) => i + 1)}
                aria-label="Next image"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
