import mongoose, { Model, Document, Schema } from "mongoose"

export interface ICampaign extends Document {
  onChainAddress: string
  creator: string
  title: string
  description: string
  metadataCID: string
  goalAmount: string // string to avoid precision issues (wei / token units)
  tokenAddress: string
  status: "pending" | "live" | "completed" | "rejected" | "cancelled"
  raisedCached?: string
  donorCountCached?: number
  createdAt: Date
  launchedAt?: Date
  slug?: string
}

const CampaignSchema = new Schema<ICampaign>(
  {
    onChainAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    creator: { type: String, required: true, lowercase: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    metadataCID: { type: String, required: true },
    goalAmount: { type: String, required: true },
    tokenAddress: { type: String, required: true, lowercase: true },
    status: {
      type: String,
      enum: ["pending", "live", "completed", "rejected", "cancelled"],
      default: "pending",
      index: true,
    },
    raisedCached: { type: String, default: "0" },
    donorCountCached: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    launchedAt: { type: Date },
    slug: { type: String, sparse: true, unique: true },
  },
  { timestamps: true }
)

CampaignSchema.index({ status: 1, createdAt: -1 })
CampaignSchema.index({ slug: 1 })

export const Campaign: Model<ICampaign> =
  mongoose.models.Campaign ||
  mongoose.model<ICampaign>("Campaign", CampaignSchema)
