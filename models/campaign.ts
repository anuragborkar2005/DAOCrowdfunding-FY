import mongoose from "mongoose"

const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  documentsCid: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

export const campaign =
  mongoose.models.campaign || mongoose.model("campaign", CampaignSchema)
