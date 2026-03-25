export interface Campaign {
  _id: string
  onChainAddress?: `0x${string}`
  creator: string
  title: string
  description: string
  category?: string
  metadataCID: string
  goalAmount: string
  tokenAddress: string
  status: "pending" | "live" | "completed" | "rejected" | "cancelled"
  raisedCached?: string
  donorCountCached?: number
  trustScore?: number
  createdAt: string
  slug?: string
}
