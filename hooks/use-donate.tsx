"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import { ABIS } from "@/lib/contracts/abis"

export function useDonate(campaignAddress: `0x${string}`) {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const donate = (amount: string) => {
    writeContract({
      address: campaignAddress,
      abi: ABIS.Campaign,
      functionName: "donate",
      args: [parseUnits(amount, 6)],
    })
  }

  return {
    donate,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}
