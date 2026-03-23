import dbConnect from "@/lib/db/connect"
import { campaign } from "@/models/campaign"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const { contractAddress, escrowAddress, status } = await request.json()

    await dbConnect()

    const updatedCampaign = await campaign.findByIdAndUpdate(
      id,
      {
        contractAddress: contractAddress?.toLowerCase(),
        escrowAddress: escrowAddress?.toLowerCase(),
        status: status || "active",
      },
      { new: true }
    )

    if (!updatedCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json(
      { message: "Success", campaign: updatedCampaign },
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
