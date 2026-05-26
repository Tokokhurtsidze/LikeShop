import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function DashboardLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  const session = await auth()
  if (!session) redirect(`/${locale}/auth/login`)

  const ka = locale === 'ka'

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {ka ? 'პირადი კაბინეტი' : 'Dashboard'}
        </h1>
        <Link
          href={`/${locale}/dashboard/new`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + {ka ? 'განცხადება' : 'New Listing'}
        </Link>
      </div>
      {children}
    </div>
  )
}
