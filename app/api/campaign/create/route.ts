import dbConnect from "@/lib/db/connect"
import { campaign } from "@/models/campaign"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { title, description, category, amount, urls } = await request.json()

    if (!title || !description || !category || !amount || !urls) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await dbConnect()

    const newCampaign = await campaign.create({
      title,
      description,
      category,
      amount,
      documentsCid: urls,
    })

    return NextResponse.json(
      { message: "Success", campaign: newCampaign },
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
