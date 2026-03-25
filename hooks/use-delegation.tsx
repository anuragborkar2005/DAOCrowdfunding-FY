"use client"

import { ABIS } from "@/lib/contracts/abis"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"

export function useDelegation() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const delegate = (delegatee: `0x${string}`) => {
    writeContract({
      abi: ABIS.GovernanceToken,
      address: CONTRACT_ADDRESSES.GovernanceToken,
      functionName: "delegate",
      args: [delegatee],
    })
  }

  return {
    delegate,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}
