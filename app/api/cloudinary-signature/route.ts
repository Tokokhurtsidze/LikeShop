import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSignatureParams } from '@/lib/cloudinary'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const params = getSignatureParams('likeshop/listings')
  return NextResponse.json(params)
}
