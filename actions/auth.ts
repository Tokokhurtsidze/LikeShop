'use server'

import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import { registerSchema, type RegisterInput } from '@/lib/validations/user'

export async function registerUser(
  input: RegisterInput
): Promise<{ success: boolean; error?: string }> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const { name, email, password, phone } = parsed.data

  await connectDB()

  const existing = await User.findOne({ email })
  if (existing) {
    return { success: false, error: 'An account with this email already exists' }
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  await User.create({ name, email, hashedPassword, phone, role: 'user' })

  return { success: true }
}
