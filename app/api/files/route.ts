import { NextResponse, type NextRequest } from "next/server"
import { pinata } from "@/utils/config"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const files: File[] = data.getAll("file") as File[]

    const results = await Promise.all(
      files.map(async (file) => {
        const { cid } = await pinata.upload.public.file(file)
        return await pinata.gateways.public.convert(cid)
      })
    )

    return NextResponse.json(results, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
