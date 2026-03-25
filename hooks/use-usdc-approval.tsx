"use client"

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi"
import { parseUnits } from "viem"
import { useMemo } from "react"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses"
import { ABIS } from "@/lib/contracts/abis"

export function useUSDCApproval(spender: `0x${string}`, amount: string) {
  const { address: owner } = useAccount()
  const amountBig = parseUnits(amount, 6)

  const { data: allowance = 0n } = useReadContract({
    address: CONTRACT_ADDRESSES.MockUSDC,
    abi: ABIS.MockUSDC,
    functionName: "allowance",
    args: [owner!, spender],
  }) as { data: bigint | undefined }

  const needsApproval = useMemo(
    () => allowance < amountBig,
    [allowance, amountBig]
  )

  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: confirming } = useWaitForTransactionReceipt({ hash })

  const approve = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.MockUSDC,
      abi: ABIS.MockUSDC,
      functionName: "approve",
      args: [spender, amountBig],
    })
  }

  return { needsApproval, approve, confirming, allowance }
}
