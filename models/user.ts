import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  address: {
    type: `0x${String}`,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const user = mongoose.models.user || mongoose.model("user", UserSchema)
