"use client"

import * as React from "react"
import Link from "next/link"
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
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useUser } from "@/context/user-context"
import { DonationModal } from "@/components/modals/donation-modal"

// Mock campaign data
const campaign = {
  id: "1",
  title: "Emergency Heart Surgery for Maria",
  category: "Medical",
  description: `Maria is a bright 12-year-old girl who loves school and dreams of becoming a doctor.

Last month, she was diagnosed with a congenital heart defect that requires immediate surgical intervention. Without this surgery, her condition will worsen significantly.

Her family, despite working multiple jobs, cannot afford the $60,000 needed for the operation and post-operative care. Maria's parents have exhausted their savings and are reaching out to the community for help.

**How the funds will be used:**
- Surgery costs: $45,000
- Hospital stay and recovery: $10,000
- Post-operative medication and checkups: $5,000

Every contribution, no matter how small, brings Maria one step closer to a healthy future. Your generosity can literally save a life.`,
  raised: 45000,
  goal: 60000,
  donors: 892,
  daysLeft: 12,
  trustScore: 98,
  status: "verified",
  creator: {
    name: "Elena Rodriguez",
    avatar: "ER",
    verified: true,
    campaignsCreated: 1,
    joinedDate: "January 2024",
  },
  daoStatus: {
    approved: true,
    votesFor: 156,
    votesAgainst: 4,
    totalVoters: 160,
  },
  documents: [
    { name: "Medical Certificate", verified: true },
    { name: "Hospital Quote", verified: true },
    { name: "ID Verification", verified: true },
  ],
  updates: [
    {
      date: "March 10, 2024",
      title: "Surgery Date Confirmed",
      content:
        "We are thrilled to announce that Maria's surgery has been scheduled for March 25th. Thank you all for your incredible support!",
    },
    {
      date: "March 5, 2024",
      title: "Halfway There!",
      content:
        "We've reached 50% of our goal! Maria and her family are overwhelmed with gratitude for the community's generosity.",
    },
  ],
  recentDonors: [
    { name: "Anonymous", amount: 500, time: "2 hours ago" },
    { name: "John D.", amount: 100, time: "5 hours ago" },
    { name: "Sarah M.", amount: 250, time: "1 day ago" },
    { name: "Anonymous", amount: 50, time: "1 day ago" },
    { name: "Michael K.", amount: 1000, time: "2 days ago" },
  ],
}

function TrustScoreCard({ score }: { score: number }) {
  const riskLevel = score >= 90 ? "Low" : score >= 70 ? "Medium" : "High"
  const riskColor =
    score >= 90
      ? "text-success"
      : score >= 70
        ? "text-warning"
        : "text-destructive"

  return (
    <Card className="border-warning/50 border-2 border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <svg
            className="text-warning h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
          </svg>
          Private: DAO Verification Only
        </CardTitle>
        <CardDescription className="text-warning text-xs">
          ⚠️ This section is visible only to DAO members. AI analysis is
          private.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 opacity-75">
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Sign in as a DAO member to view the trust score and verification
            details.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function TrustScoreDAOCard({ score }: { score: number }) {
  const riskLevel = score >= 90 ? "Low" : score >= 70 ? "Medium" : "High"
  const riskColor =
    score >= 90
      ? "text-success"
      : score >= 70
        ? "text-warning"
        : "text-destructive"

  return (
    <Card className="border-2 border-border/50 border-primary/50 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          AI Trust Score (DAO Only)
        </CardTitle>
        <CardDescription className="text-xs text-primary">
          🔒 Private verification data - visible only to DAO members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                className="stroke-muted"
                strokeWidth="8"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className="stroke-success transition-all duration-500"
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                strokeDasharray={`${score * 2.64} 264`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{score}%</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fraud Risk</span>
              <span className={`font-medium ${riskColor}`}>{riskLevel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Documents</span>
              <span className="text-success font-medium">Verified</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Identity</span>
              <span className="text-success font-medium">Confirmed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DAOStatusCard({
  daoStatus,
}: {
  daoStatus: typeof campaign.daoStatus
}) {
  const approvalRate = (daoStatus.votesFor / daoStatus.totalVoters) * 100

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          DAO Voting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge
            variant={daoStatus.approved ? "default" : "secondary"}
            className="bg-success text-success-foreground"
          >
            Approved
          </Badge>
          <span className="text-sm text-muted-foreground">
            {daoStatus.totalVoters} members voted
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Approval Rate</span>
            <span className="font-medium">{approvalRate.toFixed(1)}%</span>
          </div>
          <div className="flex gap-1">
            <div
              className="bg-success h-2 rounded-l-full"
              style={{ width: `${approvalRate}%` }}
            />
            <div
              className="h-2 rounded-r-full bg-destructive"
              style={{ width: `${100 - approvalRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{daoStatus.votesFor} For</span>
            <span>{daoStatus.votesAgainst} Against</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CampaignDetailPage() {
  const { userRole } = useUser()
  const router = useRouter()
  const [donationAmount, setDonationAmount] = React.useState("")
  const [showDonationModal, setShowDonationModal] = React.useState(false)
  const progress = (campaign.raised / campaign.goal) * 100

  const presetAmounts = [25, 50, 100, 250, 500, 1000]

  // Only DAO members can see AI Trust Score
  const canSeeTrustScore = userRole === "DAO Member"

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/campaigns" className="hover:text-foreground">
            Campaigns
          </Link>
          <span>/</span>
          <span className="text-foreground">{campaign.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Campaign Image */}
            <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <svg
                  className="h-24 w-24 text-muted-foreground/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21,15 16,10 5,21" />
                </svg>
              </div>
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  {campaign.category}
                </Badge>
              </div>
            </div>

            {/* Title and Creator */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {campaign.title}
              </h1>
              <div className="mt-4 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/avatar-fallback.svg" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {campaign.creator.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{campaign.creator.name}</span>
                    {campaign.creator.verified && (
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Member since {campaign.creator.joinedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="story">Story</TabsTrigger>
                <TabsTrigger value="updates">
                  Updates ({campaign.updates.length})
                </TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="donors">Donors</TabsTrigger>
              </TabsList>

              <TabsContent value="story" className="mt-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {campaign.description
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="whitespace-pre-line text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="updates" className="mt-6 space-y-6">
                {campaign.updates.map((update, index) => (
                  <Card key={index} className="border-border/50">
                    <CardHeader>
                      <CardDescription>{update.date}</CardDescription>
                      <CardTitle className="text-lg">{update.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{update.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <div className="space-y-3">
                  {campaign.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className="h-5 w-5 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                        </svg>
                        <span className="font-medium">{doc.name}</span>
                      </div>
                      {doc.verified && (
                        <Badge
                          variant="outline"
                          className="text-success border-success/50"
                        >
                          <svg
                            className="mr-1 h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          Verified
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="donors" className="mt-6">
                <div className="space-y-3">
                  {campaign.recentDonors.map((donor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatar-fallback.svg" />
                          <AvatarFallback className="text-xs">
                            {donor.name === "Anonymous"
                              ? "?"
                              : donor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{donor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {donor.time}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        ${donor.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Card */}
            <Card className="top-24 border-border/50 bg-card/50">
              <CardHeader>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-bold">
                        ${campaign.raised.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        of ${campaign.goal.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progress} className="mt-2 h-3" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="font-semibold">{campaign.donors}</span>
                      <span className="text-muted-foreground"> donors</span>
                    </div>
                    <div>
                      <span className="font-semibold">{campaign.daysLeft}</span>
                      <span className="text-muted-foreground"> days left</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preset amounts */}
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={
                        donationAmount === String(amount)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setDonationAmount(String(amount))}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="Other amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>

                <Button
                  className="glow-primary w-full gap-2"
                  size="lg"
                  onClick={() => setShowDonationModal(true)}
                  disabled={!donationAmount || Number(donationAmount) <= 0}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                  </svg>
                  Donate Now
                </Button>

                <Button variant="outline" className="w-full gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16,6 12,2 8,6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  Share Campaign
                </Button>
              </CardContent>
            </Card>

            {/* Trust Score */}
            {canSeeTrustScore ? (
              <TrustScoreDAOCard score={campaign.trustScore} />
            ) : (
              <TrustScoreCard score={campaign.trustScore} />
            )}

            {/* DAO Status */}
            <DAOStatusCard daoStatus={campaign.daoStatus} />
          </div>
        </div>
      </main>
      <Footer />

      <DonationModal
        open={showDonationModal}
        onOpenChange={setShowDonationModal}
        amount={donationAmount}
        campaignTitle={campaign.title}
      />
    </div>
  )
}
