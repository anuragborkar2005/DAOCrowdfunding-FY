import mongoose, { Model, Document, Schema } from "mongoose"

export interface IMilestone extends Document {
  campaignAddress: string
  milestoneId: number
  proofCID?: string
  description: string
  requestedAmount: string
  status:
    | "proposed"
    | "voting"
    | "queued"
    | "approved"
    | "rejected"
    | "released"
    | "failed"
  votesFor?: string
  votesAgainst?: string
  quorumReached?: boolean
  releasedAt?: Date
  proposalId?: string // link to governance proposal
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    campaignAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    milestoneId: { type: Number, required: true },
    proofCID: { type: String },
    description: { type: String, required: true },
    requestedAmount: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "proposed",
        "voting",
        "queued",
        "approved",
        "rejected",
        "released",
        "failed",
      ],
      default: "proposed",
    },
    votesFor: { type: String, default: "0" },
    votesAgainst: { type: String, default: "0" },
    quorumReached: { type: Boolean, default: false },
    releasedAt: { type: Date },
    proposalId: { type: String },
  },
  { timestamps: true }
)

MilestoneSchema.index({ campaignAddress: 1, milestoneId: 1 }, { unique: true })
MilestoneSchema.index({ campaignAddress: 1, status: 1 })

export const Milestone: Model<IMilestone> =
  mongoose.models.Milestone ||
  mongoose.model<IMilestone>("Milestone", MilestoneSchema)
