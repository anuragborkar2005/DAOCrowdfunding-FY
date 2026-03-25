import { NextResponse } from "next/server"
import { Campaign } from "@/models/campaign"
import dbConnect from "@/lib/db/connect"

export async function POST(request: Request) {
  await dbConnect()

  try {
    const { id, onChainAddress } = await request.json()

    if (!id || !onChainAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      { onChainAddress: onChainAddress.toLowerCase() },
      { new: true }
    )

    if (!updatedCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "On-chain address updated in database",
      campaign: updatedCampaign
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to update campaign address" },
      { status: 500 }
    )
  }
}
