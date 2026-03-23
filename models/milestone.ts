import mongoose from "mongoose"

export const MilestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
})

export const milestone =
  mongoose.models.milestone || mongoose.model("milestone", MilestoneSchema)
