import mongoose, { Model, Document, Schema } from "mongoose"

export interface IDonation extends Document {
  campaignAddress: string
  donor: string
  amount: string
  txHash: string
  blockNumber: number
  timestamp: Date
  milestoneTarget?: number // optional – if donation earmarked for specific milestone
}

const DonationSchema = new Schema<IDonation>(
  {
    campaignAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    donor: { type: String, required: true, lowercase: true },
    amount: { type: String, required: true },
    txHash: { type: String, required: true, unique: true },
    blockNumber: { type: Number, required: true },
    timestamp: { type: Date, required: true },
    milestoneTarget: { type: Number },
  },
  { timestamps: true }
)

DonationSchema.index({ campaignAddress: 1, timestamp: -1 })
DonationSchema.index({ donor: 1, campaignAddress: 1 })

export const Donation: Model<IDonation> =
  mongoose.models.Donation ||
  mongoose.model<IDonation>("Donation", DonationSchema)
