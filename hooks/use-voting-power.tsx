"use client"

import { ABIS } from "@/lib/contracts/abis"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses"
import { useReadContract } from "wagmi"
import { useAccount } from "wagmi"

export function useVotingPower() {
  const { address } = useAccount()

  const { data: currentVotes = 0n } = useReadContract({
    address: CONTRACT_ADDRESSES.GovernanceToken,
    abi: ABIS.GovernanceToken,
    functionName: "getVotes",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  return { votingPower: currentVotes }
}
