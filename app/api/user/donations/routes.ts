import dbConnect from "@/lib/db/connect"
import { Donation } from "@/models/donations"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  await dbConnect()

  const { searchParams } = new URL(request.url)
  const donor = searchParams.get("donor")?.toLowerCase()

  if (!donor) {
    return NextResponse.json(
      { error: "Donor address required" },
      { status: 400 }
    )
  }

  try {
    const donations = await Donation.find({ donor })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean()

    return NextResponse.json(donations)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    )
  }
}
