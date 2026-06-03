import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/components/chat/ChatWidget'

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
    <NextIntlClientProvider messages={messages}>
      <Navbar locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
      <ChatWidget locale={locale} />
    </NextIntlClientProvider>
  )
}
