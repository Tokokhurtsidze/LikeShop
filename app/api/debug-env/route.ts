export async function GET() {
  const uri = process.env.MONGODB_URI ?? 'NOT SET'
  const masked = uri.replace(/:([^@]+)@/, ':***@').substring(0, 120)
  return Response.json({ uri: masked })
}
