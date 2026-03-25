"use client"

import { ABIS } from "@/lib/contracts/abis"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useReadContract } from "wagmi"

export function useCampaignDetail(id: string) {
  const mongoQuery = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const res = await axios.get(`/api/campaign/${id}`)
      return res.data
    },
    enabled: !!id,
  })

  const { data: raisedOnChain } = useReadContract({
    address: mongoQuery.data?.onChainAddress as `0x${string}` | undefined,
    abi: ABIS.Campaign,
    functionName: "raised",
    query: { enabled: !!mongoQuery.data?.onChainAddress },
  })

  return {
    ...mongoQuery,
    raised: raisedOnChain ?? mongoQuery.data?.raisedCached,
  }
}
