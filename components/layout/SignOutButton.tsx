'use client'

import { signOut } from 'next-auth/react'

export function SignOutButton({ locale }: { locale: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: `/${locale}` })}
      className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
    >
      {locale === 'ka' ? 'გასვლა' : 'Log Out'}
    </button>
  )
}
