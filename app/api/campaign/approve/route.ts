import { NextResponse } from "next/server"
import { Campaign } from "@/models/campaign"
import dbConnect from "@/lib/db/connect"

export async function POST(request: Request) {
  await dbConnect()

  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Missing campaign ID" }, { status: 400 })
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      { status: "live", launchedAt: new Date() },
      { new: true }
    )

    if (!updatedCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Campaign approved and is now live",
      campaign: updatedCampaign
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to approve campaign" },
      { status: 500 }
    )
  }
}
