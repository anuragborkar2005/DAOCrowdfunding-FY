"use client"

import { Campaign } from "@/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export function useCampaignList(
  filters: { status?: string; limit?: number } = {}
) {
  return useQuery<Campaign[]>({
    queryKey: ["campaigns", filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.status) params.set("status", filters.status)
      if (filters.limit) params.set("limit", String(filters.limit))

      const res = await axios.get(`/api/campaign?${params.toString()}`)
      return res.data
    },
    staleTime: 1000 * 180, // 3 min
  })
}
