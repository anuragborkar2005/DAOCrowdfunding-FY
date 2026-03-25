import dbConnect from "@/lib/db/connect"
import { Campaign } from "@/models/campaign"
import { Donation } from "@/models/donations"
import { Milestone } from "@/models/milestone"
import { NextResponse } from "next/server"
import mongoose from "mongoose"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect()

  const id = (await params).id

  try {
    //eslint-disable-next-line
    const query: any = {
      $or: [{ slug: id }, { onChainAddress: id.toLowerCase() }],
    }

    // Only add _id to query if it's a valid ObjectId to prevent CastError
    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or.push({ _id: id })
    }

    const campaign = await Campaign.findOne(query).lean()
    console.log(campaign)

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const milestones = await Milestone.find({
      campaignAddress: campaign.onChainAddress,
    })
      .sort({ milestoneId: 1 })
      .lean()

    const recentDonations = await Donation.find({
      campaignAddress: campaign.onChainAddress,
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean()

    return NextResponse.json({
      ...campaign,
      milestones,
      recentDonations,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
