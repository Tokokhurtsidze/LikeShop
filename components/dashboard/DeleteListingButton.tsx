'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteListing } from '@/actions/listings'

interface Props {
  id: string
  locale: string
}

export function DeleteListingButton({ id, locale }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const ka = locale === 'ka'

  function handleDelete() {
    const msg = ka
      ? 'განცხადების წაშლა გსურთ? ეს შეუქცევადია.'
      : 'Delete this listing? This cannot be undone.'
    if (!confirm(msg)) return
    startTransition(async () => {
      await deleteListing(id)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? '...' : ka ? 'წაშლა' : 'Delete'}
    </button>
  )
}
