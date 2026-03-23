import mongoose from "mongoose"

const CampaignSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
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
  documentsCid: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

export const campaign = mongoose.model("campaign", CampaignSchema)
