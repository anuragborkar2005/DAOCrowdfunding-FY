import { NextResponse } from "next/server"
import dbConnect from "@/lib/db/connect"
import { Donation } from "@/models/donations"
import { Milestone } from "@/models/milestone"
import { Campaign } from "@/models/campaign"

export async function GET(request: Request) {
  await dbConnect()
  const { searchParams } = new URL(request.url)
  const campaignAddress = searchParams.get("address")?.toLowerCase()

  if (!campaignAddress) {
    return NextResponse.json({ error: "Address required" }, { status: 400 })
  }

  try {
    const [donations, milestones, campaign] = await Promise.all([
      Donation.find({ campaignAddress }).sort({ timestamp: -1 }),
      Milestone.find({ campaignAddress }).sort({ milestoneId: 1 }),
      Campaign.findOne({ onChainAddress: campaignAddress }),
    ])

    const totalDeposited = donations.reduce(
      (sum, d) => sum + BigInt(d.amount),
      0n
    )
    const totalReleased = milestones
      .filter((m) => m.status === "released")
      .reduce((sum, m) => sum + BigInt(m.requestedAmount), 0n)

    return NextResponse.json({
      campaign: {
        title: campaign?.title,
        status: campaign?.status,
        goalAmount: campaign?.goalAmount,
      },
      summary: {
        totalDeposited: totalDeposited.toString(),
        totalReleased: totalReleased.toString(),
        netBalance: (totalDeposited - totalReleased).toString(),
        donorCount: new Set(donations.map((d) => d.donor)).size,
      },
      donations: donations.map((d) => ({
        donor: d.donor,
        amount: d.amount,
        txHash: d.txHash,
        timestamp: d.timestamp,
      })),
      milestones: milestones.map((m) => ({
        id: m.milestoneId,
        description: m.description,
        amount: m.requestedAmount,
        status: m.status,
        releasedAt: m.releasedAt,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
