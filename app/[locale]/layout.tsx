import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Navbar } from '@/components/layout/Navbar'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'ka' | 'en')) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-gray-50">
        <NextIntlClientProvider messages={messages}>
          <Navbar locale={locale} />
          <main>{children}</main>
          <footer className="mt-20 border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} LikeShop. All rights reserved.
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
