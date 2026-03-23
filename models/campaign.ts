import mongoose from "mongoose"
import { MilestoneSchema } from "./milestone"

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
  creatorAddress: {
    type: String,
    required: true,
    index: true,
  },
  contractAddress: {
    type: String,
    sparse: true,
    unique: true,
  },
  escrowAddress: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "active", "failed"],
    default: "pending",
  },
  milestone: {
    type: [MilestoneSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const campaign =
  mongoose.models.campaign || mongoose.model("campaign", CampaignSchema)
