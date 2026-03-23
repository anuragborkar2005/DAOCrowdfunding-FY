import mongoose, { Model, Document, Schema } from "mongoose"

export interface IProposal extends Document {
  proposalId: string
  proposer: string
  campaignAddress?: string
  milestoneId?: number
  type: "milestone_release" | "campaign_launch" | "emergency" | "other"
  description: string
  targets: string[]
  calldatas: string[]
  status: "pending" | "active" | "queued" | "executed" | "canceled" | "defeated"
  votesFor: string
  votesAgainst: string
  quorum: string
  createdAt: Date
  votingEndsAt?: Date
}

const ProposalSchema = new Schema<IProposal>(
  {
    proposalId: { type: String, required: true, unique: true },
    proposer: { type: String, required: true, lowercase: true },
    campaignAddress: { type: String, lowercase: true, sparse: true },
    milestoneId: { type: Number, sparse: true },
    type: {
      type: String,
      enum: ["milestone_release", "campaign_launch", "emergency", "other"],
      default: "other",
    },
    description: { type: String, required: true },
    targets: [{ type: String }],
    calldatas: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "active", "queued", "executed", "canceled", "defeated"],
      default: "pending",
      index: true,
    },
    votesFor: { type: String, default: "0" },
    votesAgainst: { type: String, default: "0" },
    quorum: { type: String, default: "0" },
    createdAt: { type: Date, default: Date.now },
    votingEndsAt: { type: Date },
  },
  { timestamps: true }
)

ProposalSchema.index({ campaignAddress: 1 })
ProposalSchema.index({ status: 1 })

export const Proposal: Model<IProposal> =
  mongoose.models.Proposal ||
  mongoose.model<IProposal>("Proposal", ProposalSchema)
