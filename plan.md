# DAO Member Profile: Deployed Campaigns Implementation Plan

This document outlines the architecture for tracking, storing, and retrieving campaigns deployed by DAO members, ensuring a seamless sync between the Ethereum blockchain (On-chain) and MongoDB (Off-chain).

## 1. System Architecture Overview

The system uses a **Hybrid Data Model**:
- **On-chain:** Truth for financial state, voting results, and contract addresses.
- **Off-chain:** Metadata (titles, descriptions, categories), document links, and cached state for performant UI rendering.

## 2. Database Design (MongoDB)

### Campaign Model Update (`models/campaign.ts`)
We need to extend the current schema to link MongoDB records with the smart contracts deployed via `CampaignFactory.sol`.

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | String | (Existing) Campaign display name |
| `creatorAddress` | String (Indexed) | The wallet address of the DAO member who created it |
| `contractAddress` | String (Unique) | The address of the deployed `Campaign.sol` clone |
| `escrowAddress` | String | The address of the associated `MilestoneEscrow.sol` |
| `status` | String | `pending` (TX sent), `active` (on-chain), `failed` |
| `metadataCid` | String | The IPFS hash stored on-chain |

### User Model (`models/user.ts`)
No changes needed if using the existing `address` field to filter campaigns.

---

## 3. Blockchain & Web3 Design

### On-chain Reference (`CampaignTest.t.sol`)
As seen in the `setUp` function of the test:
1. `factory.createCampaign(...)` is called.
2. It returns `(address campAddr, address escAddr)`.
3. It emits the `CampaignCreated(address campaign, address escrow, address creator)` event.

### Web3 Integration Workflow
To capture the on-chain data after the user clicks "Submit" in the UI:

1. **Transaction Initiation:** Use `useWriteContract` to call `CampaignFactory.createCampaign`.
2. **Transaction Monitoring:** Use `useWaitForTransactionReceipt` to watch the resulting hash.
3. **Log Parsing:** Upon success, use `viem`'s `parseEventLogs` with the `CampaignFactory` ABI to extract the `campaign` and `escrow` addresses from the logs.
4. **Data Synchronization:** Call a `PATCH` API endpoint with the `mongodb_id` and the newly captured `contractAddress` and `escrowAddress`.

---

## 4. Retrieval Strategy (Off-chain)

To populate the Profile Page without hammering the RPC provider:

1. **The API Route:** Create `GET /api/user/campaigns?address=0x...`
2. **The Query:** Use `campaign.find({ creatorAddress: address.toLowerCase() }).sort({ createdAt: -1 })`.
3. **The Component:** In `app/profile/page.tsx`, use a `useEffect` hook to fetch this data when the `address` from `useAccount` is available.

---

## 5. Full Lifecycle (Referencing `test_full_flow`)

| Step | Action | Logic Location | Data Source |
| :--- | :--- | :--- | :--- |
| **1. Create** | Deploy Clone | `CampaignFactory.sol` | On-chain |
| **2. Verify** | DAO Approval | `DAOGovernor.sol` | On-chain |
| **3. Live** | `approveAndGoLive()` | `Campaign.sol` | On-chain |
| **4. Track** | Profile List | `app/profile/page.tsx` | MongoDB |
| **5. Donate** | `donate(amount)` | `Campaign.sol` | On-chain |
| **6. Milestones**| `proposeMilestone()`| `Campaign.sol` | On-chain |

## 6. Security & Validation
- **Middleware:** The API routes must verify the `creatorAddress` matches the authenticated session (via `next-auth` or signed messages) before allowing updates.
- **On-chain Verification:** A background worker can periodically verify that the `contractAddress` stored in MongoDB actually has the `msg.sender` as its `creator` in the `Campaign` contract state.
