import mongoose, { Schema, type Document, type Model } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  hashedPassword?: string
  phone?: string
  avatar?: string
  role: 'user' | 'admin'
  listings: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    hashedPassword: { type: String },
    phone: { type: String, trim: true },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    listings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }],
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema)
