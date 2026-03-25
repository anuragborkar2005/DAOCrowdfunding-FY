import { pinata } from "@/utils/config"

const PINATA_GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL!

export async function pinJSONToIPFS(data: object): Promise<string> {
  try {
    const { cid } = await pinata.upload.public.json(data)
    return cid
  } catch (err) {
    console.error("Pinata JSON upload failed:", err)
    throw err
  }
}

export async function pinFilesToIPFS(files: File[]): Promise<string[]> {
  try {
    const results = await Promise.all(
      files.map(async (file) => {
        const { cid } = await pinata.upload.public.file(file)
        return cid
      })
    )
    return results
  } catch (err) {
    console.error("Pinata multi-file upload failed:", err)
    throw err
  }
}
