import { NextResponse } from "next/server"
import { pinJSONToIPFS } from "@/lib/pinata" // your Pinata helper
import { Campaign } from "@/models/campaign"
import dbConnect from "@/lib/db/connect"

export async function POST(request: Request) {
  await dbConnect()

  try {
    const body = await request.json()
    const { title, description, goalAmount, tokenAddress, creator, category } = body

    if (!title || !description || !goalAmount || !creator) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Upload metadata to Pinata
    const metadata = {
      title,
      description,
      goalAmount,
      tokenAddress,
      creator,
      category,
      version: "1.0",
      created: new Date().toISOString(),
    }

    const cid = await pinJSONToIPFS(metadata)

    // Temporary DB entry (optimistic – onChainAddress added later by indexer)
    const tempCampaign = await Campaign.create({
      creator: creator.toLowerCase(),
      title,
      description,
      category,
      metadataCID: cid,
      goalAmount: goalAmount.toString(),
      tokenAddress: tokenAddress.toLowerCase(),
      status: "pending",
    })

    return NextResponse.json({
      cid,
      campaign: tempCampaign,
      message: "Metadata uploaded & DB record created – now call createCampaign on-chain",
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to create campaign metadata" },
      { status: 500 }
    )
  }
}
