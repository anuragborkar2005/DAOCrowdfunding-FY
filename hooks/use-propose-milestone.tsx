"use client"

import { useWriteContract } from "wagmi"
import { parseUnits } from "viem"
import { pinJSONToIPFS } from "@/lib/pinata"
import { ABIS } from "@/lib/contracts/abis"

export function useProposeMilestone(campaignAddress: `0x${string}`) {
  const { writeContract, ...rest } = useWriteContract()

  const propose = async (
    description: string,
    amount: string,
    proofFiles?: File[]
  ) => {
    // Upload proof if any
    let proofCID: string | undefined
    if (proofFiles?.length) {
      // handle file upload → folder or single JSON
      proofCID = await pinJSONToIPFS({ description, files: [] }) // simplify
    }

    writeContract({
      address: campaignAddress,
      abi: ABIS.Campaign,
      functionName: "proposeMilestone",
      args: [proofCID || "", parseUnits(amount, 6)],
    })
  }

  return { propose, ...rest }
}
