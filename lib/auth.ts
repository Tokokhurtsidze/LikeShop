import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        await connectDB()
        const user = await User.findOne({ email: credentials.email }).select('+hashedPassword')
        if (!user || !user.hashedPassword) return null
        const valid = await bcrypt.compare(credentials.password as string, user.hashedPassword)
        if (!valid) return null
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.avatar ?? null,
          role: user.role,
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB()
        const existing = await User.findOne({ email: user.email })
        if (!existing) {
          await User.create({
            name: user.name ?? 'User',
            email: user.email ?? '',
            avatar: user.image ?? undefined,
            role: 'user',
          })
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google') {
          await connectDB()
          const dbUser = await User.findOne({ email: user.email })
          token.id = dbUser?._id.toString() ?? user.id
          token.role = dbUser?.role ?? 'user'
        } else {
          token.id = user.id
          token.role = (user as { role?: string }).role ?? 'user'
        }
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
})
