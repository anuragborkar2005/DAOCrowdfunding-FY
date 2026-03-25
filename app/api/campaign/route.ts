import dbConnect from "@/lib/db/connect"
import { Campaign } from "@/models/campaign"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  await dbConnect()

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const limit = parseInt(searchParams.get("limit") || "20")
  const creator = searchParams.get("creator")?.toLowerCase()

  try {
    //eslint-disable-next-line
    const query: any = {}
    if (status) query.status = status
    if (creator) query.creator = creator

    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    )
  }
}
