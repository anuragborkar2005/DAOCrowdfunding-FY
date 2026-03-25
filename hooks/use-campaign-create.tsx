"use client"

import { useWriteContract } from "wagmi"
import { useState } from "react"
import { ABIS } from "@/lib/contracts/abis"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses"

export function useCreateCampaign() {
  const [metadataCID, setMetadataCID] = useState<string | null>(null)
  const { writeContract, isPending, data: hash } = useWriteContract()

  // Uploads metadata by calling our server-side API
  //eslint-disable-next-line
  const uploadMetadata = async (data: any) => {
    try {
      const response = await fetch("/api/campaign/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Metadata upload failed")
      const result = await response.json()
      setMetadataCID(result.cid)
      return { cid: result.cid as string, dbId: result.campaign._id as string }
    } catch (err) {
      console.error("Metadata upload error:", err)
      throw err
    }
  }

  const uploadDocuments = async (files: File[]) => {
    try {
      const formData = new FormData()
      files.forEach((file) => formData.append("documents", file))

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("File upload failed")
      return (await response.json()) as string[]
    } catch (err) {
      console.error("Document upload error:", err)
      throw err
    }
  }

  const createOnChain = (
    stablecoin: `0x${string}`,
    cid: string,
    trustScore: number = 92
  ) => {
    writeContract({
      abi: ABIS.CampaignFactory,
      address: CONTRACT_ADDRESSES.CampaignFactory,
      functionName: "createCampaign",
      args: [stablecoin, cid, BigInt(trustScore)],
    })
  }

  return {
    uploadMetadata,
    uploadDocuments,
    createOnChain,
    metadataCID,
    isPending,
    hash,
  }
}
