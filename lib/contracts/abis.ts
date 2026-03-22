import CAMPAIGN from "@/lib/contracts/abi/Campaign.json"
import CAMPAIGN_FACTORY from "@/lib/contracts/abi/CampaignFactory.json"
import DAOGOVERNOR from "@/lib/contracts/abi/DAOGovernor.json"
import GOVERNANCE_TOKEN from "@/lib/contracts/abi/GovernanceToken.json"
import MILESTONE_ESCROW from "@/lib/contracts/abi/MilestoneEscrow.json"
import MOCK_USDC from "@/lib/contracts/abi/MockUSDC.json"

export const ABIS = {
  Campaign: CAMPAIGN.abi,
  CampaignFactory: CAMPAIGN_FACTORY.abi,
  DAOGovernor: DAOGOVERNOR.abi,
  GovernanceToken: GOVERNANCE_TOKEN.abi,
  MilestoneEscrow: MILESTONE_ESCROW.abi,
  MockUSDC: MOCK_USDC.abi,
} as const
