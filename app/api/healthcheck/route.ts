import { NextResponse } from "next/server"
import dbConnect from "@/lib/db/connect"

export async function GET() {
  try {
    await dbConnect()
    return NextResponse.json(
      { status: "ok", message: "Connected to DB" },
      { status: 200 }
    )
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { status: "error", message: "DB connection failed" },
      { status: 500 }
    )
  }
}
