import { v2 as cloudinary } from 'cloudinary'
import { auth } from '@/lib/auth'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const result = await new Promise<{ public_id: string; secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'likeshop', resource_type: 'image' },
          (err, res) => {
            if (err || !res) return reject(err)
            resolve(res)
          }
        )
        .end(buffer)
    }
  )

  return Response.json({
    publicId: result.public_id,
    url: result.secure_url,
  })
}
