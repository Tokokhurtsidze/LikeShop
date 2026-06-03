import mongoose from 'mongoose'

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

global._mongoose ??= { conn: null, promise: null }

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI environment variable not set')

  const cached = global._mongoose

  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .catch((err) => {
        cached.promise = null
        throw err
      })
  }
  cached.conn = await cached.promise
  return cached.conn
}
