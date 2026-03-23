import mongoose, { Model, Document, Schema } from "mongoose"

export interface IUser extends Document {
  wallet: string
  username?: string
  bio?: string
  profilePicCID?: string
  createdAt: Date
  lastActive: Date
  totalDonated?: number
}

const UserSchema = new Schema<IUser>(
  {
    wallet: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    username: { type: String, sparse: true, unique: true },
    bio: { type: String },
    profilePicCID: { type: String },
    createdAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    totalDonated: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
