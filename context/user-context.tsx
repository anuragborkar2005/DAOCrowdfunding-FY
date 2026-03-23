"use client"

import React, { createContext, useContext, useState } from "react"

export type UserRole = "donor" | "creator" | "dao_member" | "admin"

interface UserContextType {
  userRole: UserRole | null
  setUserRole: (role: UserRole) => void
  userName: string
  setUserName: (name: string) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [userName, setUserName] = useState("")

  const logout = () => {
    setUserRole(null)
    setUserName("")
  }

  return (
    <UserContext.Provider
      value={{
        userRole,
        setUserRole,
        userName,
        setUserName,
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
