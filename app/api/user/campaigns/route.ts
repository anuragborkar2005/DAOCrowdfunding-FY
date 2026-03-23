import dbConnect from "@/lib/db/connect"
import { campaign } from "@/models/campaign"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    await dbConnect()

    const userCampaigns = await campaign.find({
      creatorAddress: address.toLowerCase()
    }).sort({ createdAt: -1 })

    return NextResponse.json(
      { message: "Success", campaigns: userCampaigns },
      { status: 200 }
    )
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
