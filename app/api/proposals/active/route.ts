import dbConnect from "@/lib/db/connect"
import { Proposal } from "@/models/proposal"
import { Campaign } from "@/models/campaign"
import { NextResponse } from "next/server"

export async function GET() {
  await dbConnect()

  try {
    // 1. Fetch active on-chain proposals
    const proposals = await Proposal.find({
      status: { $in: ["pending", "active", "queued"] },
    })
      .sort({ createdAt: -1 })
      .lean()

    // 2. Fetch pending campaigns that haven't been approved by the DAO yet
    const pendingCampaigns = await Campaign.find({
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .lean()

    // 3. Map campaigns to a proposal-like interface for the UI
    const campaignProposals = pendingCampaigns.map((c) => ({
      _id: c._id,
      proposalId: `campaign-${c._id}`, // Synthetic ID for UI
      proposer: c.creator,
      type: "campaign_launch",
      description: `New Campaign: ${c.title}\n\n${c.description}`,
      status: "active", // Treat as active for voting UI
      votesFor: "0",
      votesAgainst: "0",
      createdAt: c.createdAt,
      metadataCID: c.metadataCID,
      onChainAddress: c.onChainAddress,
      isCampaignApproval: true,
      campaignId: c._id,
    }))

    // Combine and return
    const allItems = [...proposals, ...campaignProposals].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json(allItems)
  } catch (error) {
    console.error("Proposals fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch active items" },
      { status: 500 }
    )
  }
}
