'use client'

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'

interface PropertyMapProps {
  lat: number
  lng: number
  title?: string
}

export function PropertyMap({ lat, lng, title }: PropertyMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  if (!apiKey) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500">
        Google Maps API key not configured
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-72 w-full overflow-hidden rounded-xl">
        <Map
          defaultCenter={{ lat, lng }}
          defaultZoom={15}
          gestureHandling="cooperative"
          disableDefaultUI={false}
        >
          <Marker position={{ lat, lng }} title={title} />
        </Map>
      </div>
    </APIProvider>
  )
}
