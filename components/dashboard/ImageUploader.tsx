'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'

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
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const ka = locale === 'ka'

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return
    if (value.length + files.length > maxImages) {
      setError(
        ka
          ? `მაქსიმუმ ${maxImages} ფოტო`
          : `Maximum ${maxImages} photos allowed`
      )
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const sigRes = await fetch('/api/cloudinary-signature')
      if (!sigRes.ok) throw new Error('Failed to get signature')
      const { timestamp, signature, apiKey, cloudName, folder } =
        await sigRes.json()

      const uploaded: UploadedImage[] = []
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('api_key', apiKey)
        formData.append('timestamp', String(timestamp))
        formData.append('signature', signature)
        formData.append('folder', folder)

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: formData }
        )
        const data = await res.json()
        if (data.error) throw new Error(data.error.message)

        uploaded.push({
          publicId: data.public_id,
          url: data.secure_url,
          alt: file.name.replace(/\.[^/.]+$/, ''),
        })
      }

      onChange([...value, ...uploaded])
    } catch (err) {
      setError(
        ka ? 'ფოტოს ატვირთვა ვერ მოხერხდა' : 'Failed to upload image'
      )
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  function removeImage(publicId: string) {
    onChange(value.filter((img) => img.publicId !== publicId))
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition-colors hover:border-blue-400 hover:bg-blue-50"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFiles(e.dataTransfer.files)
        }}
      >
        <svg
          className="mb-3 h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm font-medium text-gray-700">
          {isUploading
            ? ka
              ? 'იტვირთება...'
              : 'Uploading...'
            : ka
            ? 'ფოტოს ატვირთვა'
            : 'Upload photos'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {ka ? 'ან გადმოიტანეთ' : 'or drag and drop'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
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
                alt={img.alt}
                fill
                className="object-cover"
                sizes="120px"
              />
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/80 py-0.5 text-center text-xs text-white">
                  {ka ? 'მთავარი' : 'Cover'}
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(img.publicId)}
                className="absolute top-1 right-1 hidden rounded-full bg-red-500 p-1 text-white group-hover:flex"
                aria-label="Remove image"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
