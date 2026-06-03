import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'LikeShop — Georgian Real Estate Marketplace', template: '%s | LikeShop' },
  description: 'Find apartments, houses, cottages and commercial properties for sale and rent across Georgia. Browse thousands of verified real estate listings in Tbilisi, Batumi, Kutaisi and beyond.',
  keywords: ['real estate Georgia', 'property for sale Tbilisi', 'apartments Georgia', 'house for rent Tbilisi', 'Georgian real estate', 'უძრავი ქონება', 'ბინა თბილისი', 'სახლი გასაყიდად'],
  authors: [{ name: 'LikeShop' }],
  creator: 'LikeShop',
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'LikeShop',
    title: 'LikeShop — Georgian Real Estate Marketplace',
    description: 'Find your perfect property in Georgia',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LikeShop — Georgian Real Estate',
    description: 'Find apartments, houses and commercial properties across Georgia',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
