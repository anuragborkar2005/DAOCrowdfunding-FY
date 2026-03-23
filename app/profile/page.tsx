"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/context/user-context"
import { useAccount } from "wagmi"
import {
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  CopyIcon,
  HeartIcon,
  MedalIcon,
  ShieldIcon,
  WalletIcon,
  TrendUpIcon,
  UserIcon,
  BellIcon,
  LinkIcon,
} from "@phosphor-icons/react"
import { useAppKitAccount } from "@reown/appkit/react"

const userStats = {
  totalDonated: "12.5 ETH",
  campaignsSupported: 8,
  votesParticipated: 23,
  trustScore: 92,
  memberSince: "Jan 2024",
  walletAddress: "0x1234...5678",
}

const myDonations = [
  {
    id: 1,
    campaign: "Clean Water Initiative",
    amount: "2.5 ETH",
    date: "Mar 15, 2024",
    status: "Completed",
  },
  {
    id: 2,
    campaign: "Solar Schools Project",
    amount: "1.8 ETH",
    date: "Mar 10, 2024",
    status: "Completed",
  },
  {
    id: 3,
    campaign: "Community Health Center",
    amount: "3.2 ETH",
    date: "Feb 28, 2024",
    status: "In Progress",
  },
  {
    id: 4,
    campaign: "Urban Farming Network",
    amount: "2.0 ETH",
    date: "Feb 15, 2024",
    status: "Completed",
  },
  {
    id: 5,
    campaign: "Education for All",
    amount: "3.0 ETH",
    date: "Jan 20, 2024",
    status: "Completed",
  },
]

const myVotes = [
  {
    id: 1,
    proposal: "Milestone 2 Fund Release - Clean Water",
    vote: "For",
    date: "Mar 14, 2024",
    outcome: "Passed",
  },
  {
    id: 2,
    proposal: "Emergency Reallocation Request",
    vote: "Against",
    date: "Mar 10, 2024",
    outcome: "Rejected",
  },
  {
    id: 3,
    proposal: "New Campaign Category Addition",
    vote: "For",
    date: "Mar 5, 2024",
    outcome: "Passed",
  },
  {
    id: 4,
    proposal: "Platform Fee Reduction",
    vote: "For",
    date: "Feb 28, 2024",
    outcome: "Pending",
  },
]

const achievements = [
  {
    id: 1,
    title: "Early Adopter",
    description: "Joined in the first month",
    icon: MedalIcon,
    unlocked: true,
  },
  {
    id: 2,
    title: "Generous Donor",
    description: "Donated over 10 ETH",
    icon: HeartIcon,
    unlocked: true,
  },
  {
    id: 3,
    title: "Active Voter",
    description: "Participated in 20+ votes",
    icon: CheckIcon,
    unlocked: true,
  },
  {
    id: 4,
    title: "Trusted Member",
    description: "Achieved 90+ trust score",
    icon: ShieldIcon,
    unlocked: true,
  },
  {
    id: 5,
    title: "Campaign Creator",
    description: "Created a successful campaign",
    icon: TrendUpIcon,
    unlocked: false,
  },
  {
    id: 6,
    title: "Community Leader",
    description: "Referred 10+ members",
    icon: UserIcon,
    unlocked: false,
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { userName, userRole } = useUser()
  const { address } = useAccount()
  const [myCampaigns, setMyCampaigns] = useState([])
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      if (address) {
        setIsFetching(true)
        try {
          const res = await fetch(`/api/user/campaigns?address=${address}`)
          if (res.ok) {
            const data = await res.json()
            setMyCampaigns(data.campaigns || [])
          }
        } catch (error) {
          console.error("Error fetching my campaigns:", error)
        } finally {
          setIsFetching(false)
        }
      }
    }

    fetchMyCampaigns()
  }, [address])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto max-w-7xl px-4 py-8 pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Profile Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Profile Card */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="mb-4 h-24 w-24">
                    <AvatarImage src="/avatar-fallback.svg" />
                    <AvatarFallback className="bg-primary/20 text-2xl text-primary">
                      {userName?.slice(0, 2).toUpperCase() || <UserIcon />}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-foreground">
                    {userName}
                  </h2>

                  <div className="mt-3 flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5">
                    <WalletIcon className="h-4 w-4 text-primary" />
                    <span className="font-mono text-sm">{userName}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <CopyIcon className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary"
                    >
                      <ShieldIcon className="mr-1 h-3 w-3" />
                      Trust Score: {userStats.trustScore}
                    </Badge>
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    Member since {userStats.memberSince}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Your Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Donated</span>
                  <span className="font-bold text-primary">
                    {userStats.totalDonated}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Campaigns Supported
                  </span>
                  <span className="font-bold">
                    {userStats.campaignsSupported}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Votes Cast</span>
                  <span className="font-bold">
                    {userStats.votesParticipated}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
                <CardDescription>4 of 6 unlocked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex flex-col items-center rounded-lg border p-3 transition-colors ${
                        achievement.unlocked
                          ? "border-primary/30 bg-primary/10"
                          : "border-border/50 bg-muted/30 opacity-50"
                      }`}
                      title={achievement.description}
                    >
                      <achievement.icon
                        className={`mb-1 h-6 w-6 ${achievement.unlocked ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span className="text-center text-xs font-medium">
                        {achievement.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="donations" className="space-y-6">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="donations">My Donations</TabsTrigger>
                {userRole === "DAO Member" && (
                  <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
                )}
                <TabsTrigger value="votes">Voting History</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="donations" className="space-y-4">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Donation History</CardTitle>
                    <CardDescription>
                      Track all your contributions and their impact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {myDonations.map((donation) => (
                        <div
                          key={donation.id}
                          className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                              <HeartIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{donation.campaign}</p>
                              <p className="text-sm text-muted-foreground">
                                {donation.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">
                              {donation.amount}
                            </p>
                            <Badge
                              variant={
                                donation.status === "Completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {donation.status === "Completed" ? (
                                <CheckCircleIcon className="mr-1 h-3 w-3" />
                              ) : (
                                <ClockIcon className="mr-1 h-3 w-3" />
                              )}
                              {donation.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {userRole === "DAO Member" && (
                <TabsContent value="campaigns" className="space-y-4">
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>My Deployed Campaigns</CardTitle>
                      <CardDescription>
                        Manage and track your fundraising efforts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {isFetching ? (
                          <div className="py-8 text-center text-muted-foreground">
                            Loading campaigns...
                          </div>
                        ) : myCampaigns.length === 0 ? (
                          <div className="py-8 text-center text-muted-foreground">
                            You haven't deployed any campaigns yet.
                          </div>
                        ) : (
                          myCampaigns.map((camp: any) => (
                            <div
                              key={camp._id}
                              className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                                  <TrendUpIcon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{camp.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Target: ${camp.amount}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  variant={
                                    camp.status === "active"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {camp.status}
                                </Badge>
                                <Link
                                  href={`/campaigns/${camp._id}`}
                                  className="mt-2 block text-xs text-primary hover:underline"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="votes" className="space-y-4">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Voting History</CardTitle>
                    <CardDescription>
                      Your participation in DAO governance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {myVotes.map((vote) => (
                        <div
                          key={vote.id}
                          className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                vote.vote === "For"
                                  ? "bg-green-500/20"
                                  : "bg-red-500/20"
                              }`}
                            >
                              <CheckIcon
                                className={`h-5 w-5 ${vote.vote === "For" ? "text-green-500" : "text-red-500"}`}
                              />
                            </div>
                            <div>
                              <p className="font-medium">{vote.proposal}</p>
                              <p className="text-sm text-muted-foreground">
                                {vote.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                vote.vote === "For" ? "default" : "destructive"
                              }
                              className="mb-1"
                            >
                              Voted {vote.vote}
                            </Badge>
                            <p
                              className={`text-sm font-medium ${
                                vote.outcome === "Passed"
                                  ? "text-green-500"
                                  : vote.outcome === "Rejected"
                                    ? "text-red-500"
                                    : "text-yellow-500"
                              }`}
                            >
                              {vote.outcome}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Manage your account information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Display Name</Label>
                        <Input defaultValue="John Doe" disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          defaultValue="john.doe@email.com"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button onClick={() => setIsEditing(false)}>
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BellIcon className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Campaign Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates from campaigns you support
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 accent-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Voting Reminders</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new proposals
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 accent-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Milestone Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Alerts when milestones are reached
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 accent-primary"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <WalletIcon className="h-5 w-5" />
                      Wallet Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Connected Wallet</p>
                          <p className="font-mono text-sm text-muted-foreground">
                            {userName}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <LinkIcon className="mr-2 h-4 w-4" />
                          View on Explorer
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Disconnect Wallet
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
