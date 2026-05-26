import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'LikeShop — Georgian Real Estate', template: '%s | LikeShop' },
  description: 'Find properties for sale and rent in Georgia — apartments, houses, commercial spaces.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
