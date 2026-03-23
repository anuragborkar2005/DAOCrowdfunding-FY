"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/context/user-context"

export default function AuthPage() {
  const router = useRouter()
  const { setUserRole, setUserName } = useUser()
  const [step, setStep] = useState<"role" | "name">("role")
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [name, setName] = useState("")

  const roles = [
    {
      id: "donor",
      title: "Donor",
      description: "Support campaigns and contribute to causes you believe in",
      icon: "💝",
    },
    {
      id: "creator",
      title: "Campaign Creator",
      description:
        "Start a campaign and reach out to the community for support",
      icon: "🚀",
    },
    {
      id: "dao_member",
      title: "DAO Member",
      description:
        "Verify campaigns, vote on proposals, and ensure platform integrity",
      icon: "🛡️",
    },
    {
      id: "admin",
      title: "Administrator",
      description: "Manage platform, users, and system settings",
      icon: "⚙️",
    },
  ]

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    setStep("name")
  }

  const handleLogin = () => {
    if (name.trim() && selectedRole) {
      //eslint-disable-next-line
      setUserRole(selectedRole as any)
      setUserName(name)
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Step: Role Selection */}
        {step === "role" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome to CrowdDAO
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Select your role to continue
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {roles.map((role) => (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all hover:border-primary ${
                    selectedRole === role.id
                      ? "border-primary bg-primary/5"
                      : "border-border/50"
                  }`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardHeader>
                    <div className="mb-2 text-4xl">{role.icon}</div>
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{role.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step: Name Entry */}
        {step === "name" && (
          <div className="mx-auto max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome, {roles.find((r) => r.id === selectedRole)?.title}
              </h2>
              <p className="mt-2 text-muted-foreground">
                Enter your name to continue
              </p>
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep("role")
                      setSelectedRole("")
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleLogin}
                    disabled={!name.trim()}
                    className="glow-primary flex-1"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground">
              This is a demo. No real authentication is required.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
