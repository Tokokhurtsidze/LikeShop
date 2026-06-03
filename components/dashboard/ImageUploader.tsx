'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface UploadedImage {
  publicId: string
  url: string
  alt: string
}

interface ImageUploaderProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  locale?: string
  maxImages?: number
}

export function ImageUploader({
  value,
  onChange,
  locale = 'en',
  maxImages = 10,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const ka = locale === 'ka'

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    if (value.length >= maxImages) {
      setError(ka ? `მაქსიმუმ ${maxImages} ფოტო` : `Maximum ${maxImages} photos`)
      return
    }

    setError(null)
    setUploading(true)

    const remaining = maxImages - value.length
    const toUpload = Array.from(files).slice(0, remaining)
    const uploaded: UploadedImage[] = []

    for (const file of toUpload) {
      if (!file.type.startsWith('image/')) continue
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        setError(ka ? 'ატვირთვა ვერ მოხერხდა' : 'Upload failed')
        continue
      }
      const data = await res.json()
      uploaded.push({ publicId: data.publicId, url: data.url, alt: '' })
    }

    onChange([...value, ...uploaded])
    setUploading(false)
  }

  function removeImage(publicId: string) {
    onChange(value.filter((img) => img.publicId !== publicId))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {ka ? 'იტვირთება...' : 'Uploading...'}
          </div>
        ) : (
          <>
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm font-medium text-gray-700">
              {ka ? 'ფოტოს ასატვირთად დააჭირეთ ან გადმოიტანეთ' : 'Click to upload or drag & drop'}
            </p>
            <p className="text-xs text-gray-400">
              {ka ? `PNG, JPG, WEBP — მაქსიმუმ ${maxImages}` : `PNG, JPG, WEBP — max ${maxImages}`}
            </p>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {value.map((img, i) => (
            <div
              key={img.publicId}
              className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200"
            >
              <Image
                src={img.url}
                alt={img.alt || 'listing image'}
                fill
                className="object-cover"
                sizes="120px"
                unoptimized
              />
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/80 py-0.5 text-center text-xs text-white">
                  {ka ? 'მთავარი' : 'Cover'}
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(img.publicId)}
                className="absolute right-1 top-1 hidden rounded-full bg-red-500 p-1 text-white group-hover:flex"
                aria-label="Remove image"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
