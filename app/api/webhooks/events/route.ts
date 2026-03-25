import { NextResponse } from "next/server"
import dbConnect from "@/lib/db/connect"
import { Campaign } from "@/models/campaign"
import { Donation } from "@/models/donations"
import { Milestone } from "@/models/milestone"

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await dbConnect()

  try {
    const body = await request.json()
    const { eventName, data } = body

    if (eventName === "CampaignCreated") {
      await Campaign.findOneAndUpdate(
        { onChainAddress: data.campaignAddress.toLowerCase() },
        {
          onChainAddress: data.campaignAddress.toLowerCase(),
          creator: data.creator.toLowerCase(),
          status: "pending",
          // update other fields if indexer provides more
        },
        { upsert: true, new: true }
      )
    }

    if (eventName === "DonationReceived") {
      await Donation.create({
        campaignAddress: data.campaignAddress.toLowerCase(),
        donor: data.donor.toLowerCase(),
        amount: data.amount.toString(),
        txHash: data.txHash,
        blockNumber: data.blockNumber,
        timestamp: new Date(data.timestamp * 1000),
      })
    }

    if (eventName === "CampaignLive") {
      await Campaign.findOneAndUpdate(
        { onChainAddress: data.campaignAddress.toLowerCase() },
        { status: "live", launchedAt: new Date() }
      )
    }

    if (eventName === "MilestoneProposed") {
      // Create Milestone record in MongoDB linked to Campaign
      const milestone = await Milestone.findOneAndUpdate(
        {
          campaignAddress: data.campaignAddress.toLowerCase(),
          milestoneId: data.id,
        },
        {
          campaignAddress: data.campaignAddress.toLowerCase(),
          milestoneId: data.id,
          proofCID: data.proofCid,
          requestedAmount: data.amount.toString(),
          status: "proposed",
          description: "Milestone proposed on-chain", // update if metadata exists
        },
        { upsert: true, new: true }
      )
    }

    if (eventName === "MilestoneReleased") {
      await Milestone.findOneAndUpdate(
        {
          campaignAddress: data.campaignAddress.toLowerCase(),
          milestoneId: data.id,
        },
        { status: "released", releasedAt: new Date() }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
