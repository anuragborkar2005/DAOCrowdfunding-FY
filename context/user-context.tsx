"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useAccount, useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses"
import { ABIS } from "@/lib/contracts/abis"
import { useDisconnect } from "@reown/appkit/react"

export type UserRole = "Donor" | "DAO Member" | "Admin"

interface UserContextType {
  userRole: UserRole | null
  setUserRole: (role: UserRole) => void
  userName: string
  setUserName: (name: string) => void
  isLoading: boolean
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Hardcoded admins for demonstration - in production, this could be the contract owner address
const ADMIN_ADDRESSES = ["0xab12d2c3edece57e3c32307fa5f660d042161169"].map(
  (a) => a.toLowerCase()
)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Check Voting Power to determine if user is a DAO member
  const { data: votingPower, isLoading: isVotesLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.GovernanceToken as `0x${string}`,
    abi: ABIS.GovernanceToken,
    functionName: "getVotes",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Also check Token Balance so that users who delegated their power are still DAO Members
  const { data: tokenBalance, isLoading: isBalanceLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.GovernanceToken as `0x${string}`,
    abi: ABIS.GovernanceToken,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  useEffect(() => {
    if (!isConnected || !address) {
      setUserRole(null)
      setUserName("")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const userAddr = address.toLowerCase()

    // 1. Check if Admin
    if (ADMIN_ADDRESSES.includes(userAddr)) {
      setUserRole("Admin")
      setUserName("Admin User")
    }
    // 2. Check if DAO Member (has active voting power OR holds tokens)
    else if (
      (votingPower && (votingPower as bigint) > 0n) ||
      (tokenBalance && (tokenBalance as bigint) > 0n)
    ) {
      setUserRole("DAO Member")
      setUserName(address.slice(0, 6) + "...")
    }
    // 3. Default to Donor
    else {
      setUserRole("Donor")
      setUserName(address.slice(0, 6) + "...")
    }

    setIsLoading(false)
  }, [address, isConnected, votingPower, tokenBalance])

  const logout = () => {
    setUserRole(null)
    setUserName("")
    disconnect()
  }

  return (
    <UserContext.Provider
      value={{
        userRole,
        setUserRole,
        userName,
        setUserName,
        isLoading: isLoading || isVotesLoading || isBalanceLoading,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}
