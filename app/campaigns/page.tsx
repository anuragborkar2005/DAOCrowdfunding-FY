"use client"

import * as React from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const campaigns = [
  {
    id: "1",
    title: "Emergency Heart Surgery for Maria",
    category: "Medical",
    description:
      "Help Maria, a 12-year-old girl, receive life-saving heart surgery. Every contribution brings her closer to a healthy future.",
    raised: 45000,
    goal: 60000,
    donors: 892,
    daysLeft: 12,
    trustScore: 98,
    status: "verified",
  },
  {
    id: "2",
    title: "Rebuild School After Earthquake",
    category: "Disaster Relief",
    description:
      "Support the reconstruction of a primary school destroyed by the recent earthquake, giving 500+ children access to education.",
    raised: 128000,
    goal: 200000,
    donors: 2341,
    daysLeft: 28,
    trustScore: 95,
    status: "verified",
  },
  {
    id: "3",
    title: "Clean Water Initiative for Rural Village",
    category: "Community",
    description:
      "Bring clean drinking water to a village of 2,000 people. Sustainable water filtration system installation.",
    raised: 32000,
    goal: 40000,
    donors: 567,
    daysLeft: 8,
    trustScore: 97,
    status: "verified",
  },
  {
    id: "4",
    title: "Cancer Treatment Fund for Single Mother",
    category: "Medical",
    description:
      "Help Sarah, a single mother of two, afford life-saving cancer treatment. Your support can give her children their mother back.",
    raised: 78000,
    goal: 100000,
    donors: 1245,
    daysLeft: 20,
    trustScore: 96,
    status: "verified",
  },
  {
    id: "5",
    title: "Food Security for Refugee Camp",
    category: "Humanitarian",
    description:
      "Provide essential food supplies to 5,000 refugees for six months. Every dollar helps feed a family in need.",
    raised: 156000,
    goal: 250000,
    donors: 3892,
    daysLeft: 45,
    trustScore: 99,
    status: "verified",
  },
  {
    id: "6",
    title: "Solar Panels for Remote Clinic",
    category: "Community",
    description:
      "Install solar power in a remote health clinic serving 10,000 people. Reliable electricity saves lives.",
    raised: 18500,
    goal: 35000,
    donors: 289,
    daysLeft: 15,
    trustScore: 94,
    status: "verified",
  },
]

const categories = [
  "All",
  "Medical",
  "Disaster Relief",
  "Community",
  "Humanitarian",
  "Education",
]

function TrustScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "text-success"
      : score >= 70
        ? "text-warning"
        : "text-destructive"

  return (
    <div className={`flex items-center gap-1 text-sm font-medium ${color}`}>
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      {score}% Trust
    </div>
  )
}

function CampaignCard({ campaign }: { campaign: (typeof campaigns)[0] }) {
  const progress = (campaign.raised / campaign.goal) * 100

  return (
    <Card className="group overflow-hidden border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
          <svg
            className="h-16 w-16 text-muted-foreground/50"
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
        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="bg-background/80 backdrop-blur-sm"
          >
            {campaign.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 leading-tight font-semibold group-hover:text-primary">
            {campaign.title}
          </h3>
        </div>
        <TrustScoreBadge score={campaign.trustScore} />
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {campaign.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              ${campaign.raised.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              of ${campaign.goal.toLocaleString()}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{campaign.donors.toLocaleString()} donors</span>
          <span>{campaign.daysLeft} days left</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/campaigns/${campaign.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Campaign
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [sortBy, setSortBy] = React.useState("newest")

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || campaign.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Campaigns
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover verified campaigns and make a difference today
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative max-w-md flex-1">
              <svg
                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
              <SelectItem value="most-funded">Most Funded</SelectItem>
              <SelectItem value="trust-score">Trust Score</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campaign Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="py-16 text-center">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold">No campaigns found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
