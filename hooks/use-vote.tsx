"use client"

import { ABIS } from "@/lib/contracts/abis"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses"
import { useWriteContract } from "wagmi"
import { encodeFunctionData } from "viem"

export function useVote() {
  const { writeContract, ...rest } = useWriteContract()

  const castVote = (proposalId: bigint, support: 0 | 1 | 2) => {
    writeContract({
      abi: ABIS.DAOGovernor,
      address: CONTRACT_ADDRESSES.DAOGovernor,
      functionName: "castVote",
      args: [proposalId, support],
    })
  }

  const proposeCampaignLaunch = (
    campaignAddress: `0x${string}`,
    description: string
  ) => {
    const calldata = encodeFunctionData({
      abi: ABIS.Campaign,
      functionName: "approveAndGoLive",
      args: [],
    })

    writeContract({
      abi: ABIS.DAOGovernor,
      address: CONTRACT_ADDRESSES.DAOGovernor,
      functionName: "propose",
      args: [[campaignAddress], [0n], [calldata], description],
    })
  }

  const proposeRelease = (
    campaignAddress: `0x${string}`,
    milestoneId: number,
    description: string
  ) => {
    const calldata = encodeFunctionData({
      abi: ABIS.Campaign,
      functionName: "releaseMilestone",
      args: [BigInt(milestoneId)],
    })

    writeContract({
      abi: ABIS.DAOGovernor,
      address: CONTRACT_ADDRESSES.DAOGovernor,
      functionName: "propose",
      args: [[campaignAddress], [0n], [calldata], description],
    })
  }

  const executeProposal = (
    targets: `0x${string}`[],
    values: bigint[],
    calldatas: `0x${string}`[],
    descriptionHash: `0x${string}`
  ) => {
    writeContract({
      abi: ABIS.DAOGovernor,
      address: CONTRACT_ADDRESSES.DAOGovernor,
      functionName: "execute",
      args: [targets, values, calldatas, descriptionHash],
    })
  }

  return {
    castVote,
    proposeCampaignLaunch,
    proposeRelease,
    executeProposal,
    ...rest,
  }
}
