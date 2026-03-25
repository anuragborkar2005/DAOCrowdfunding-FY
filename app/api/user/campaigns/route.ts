import { NextResponse } from "next/server"
import { Campaign } from "@/models/campaign"
import dbConnect from "@/lib/db/connect"

export async function GET(request: Request) {
  await dbConnect()

  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")?.toLowerCase()

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 })
  }

  try {
    const campaigns = await Campaign.find({ creator: address })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch user campaigns" },
      { status: 500 }
    )
  }
}
