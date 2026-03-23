"use client"

import * as React from "react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useConnection, useWriteContract } from "wagmi"
import { ABIS } from "@/lib/contracts/abis"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses"

const categories = [
  "Medical",
  "Disaster Relief",
  "Community",
  "Humanitarian",
  "Education",
  "Environment",
  "Other",
]

type Step = 1 | 2 | 3

export default function CreateCampaignPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState<Step>(1)
  const [formData, setFormData] = React.useState({
    title: "",
    category: "",
    goal: "",
    description: "",
    documents: [] as File[],
  })
  const { writeContract } = useWriteContract()
  const { address } = useConnection()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(e.target.files!)],
      }))
    }
  }

  const handleFileUpload = async () => {
    if (formData.documents.length === 0) {
      alert("Please upload at least one document.")
      return
    }
    const form = new FormData()
    Array.from(formData.documents).forEach((file) => {
      form.append("documents", file)
    })
    const res = await fetch("/api/files", {
      method: "POST",
      body: form,
    })

    if (res.ok) {
      const data = await res.json()
      return data
    } else {
      console.error("Upload failed:", res.status, await res.text())
    }
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    try {
      let uploadedUrls: string[] = []

      // Always upload if documents exist
      if (formData.documents.length > 0) {
        uploadedUrls = await handleFileUpload()
      }

      const res = await fetch("/api/campaign/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          amount: formData.goal,
          urls: uploadedUrls,
          creatorAddress: address,
        }),
      })

      if (res.ok) {
        const { campaign } = await res.json()
        writeContract({
          abi: ABIS.CampaignFactory,
          address: CONTRACT_ADDRESSES.CampaignFactory,
          functionName: "createCampaign",
          args: [CONTRACT_ADDRESSES.MockUSDC, campaign._id, 92],
        })
        // In a production app, we would wait for the receipt and then call the PATCH API
        // For now, we move to success step
        setCurrentStep(3)
      } else {
        console.error(
          "Campaign submission failed:",
          res.status,
          await res.text()
        )
      }
    } catch (error) {
      console.error("Submission failed:", error)
    }
  }

  const steps = [
    { id: 1, title: "Details", description: "Campaign info" },
    { id: 2, title: "Documents", description: "Upload proofs" },
    { id: 3, title: "Submit", description: "DAO review" },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create Campaign
          </h1>
          <p className="mt-2 text-muted-foreground">
            Launch your fundraising campaign in minutes
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                      currentStep >= step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="mt-2 hidden text-xs text-muted-foreground sm:block">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 sm:mx-4 ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Campaign Details */}
        {currentStep === 1 && (
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>
                Tell us about your campaign and fundraising goal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a compelling title for your campaign"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value || "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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

              <div className="space-y-2">
                <Label htmlFor="goal">Funding Goal (USD)</Label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="goal"
                    name="goal"
                    type="number"
                    placeholder="0"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="pl-7"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Campaign Story</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Share your story and explain why you need support..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                />
              </div>

              <Button
                className="w-full"
                onClick={() => setCurrentStep(2)}
                disabled={
                  !formData.title ||
                  !formData.category ||
                  !formData.goal ||
                  !formData.description
                }
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Documents */}
        {currentStep === 2 && (
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Provide supporting documents to verify your campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                <input
                  type="file"
                  id="documents"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <label
                  htmlFor="documents"
                  className="flex cursor-pointer flex-col items-center"
                >
                  <svg
                    className="h-12 w-12 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-4 text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PDF, JPG, PNG, DOC up to 10MB each
                  </p>
                </label>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Recommended Documents:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    Medical certificates or hospital quotes
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    ID verification documents
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    Proof of situation (photos, letters)
                  </li>
                </ul>
              </div>

              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded Files:</p>
                  <div className="space-y-2">
                    {formData.documents.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/50 p-3"
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
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={formData.documents.length === 0}
                >
                  Submit for DAO Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Success */}
        {currentStep === 3 && (
          <Card className="border-border/50 bg-card/50">
            <CardContent className="py-12 text-center">
              <div className="bg-success/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                <svg
                  className="text-success h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Campaign Submitted!</h2>
              <p className="mt-2 text-muted-foreground">
                Your campaign has been submitted for DAO verification. Our AI
                will analyze your documents and verify all information.
              </p>

              <div className="mt-6 space-y-3 rounded-lg border border-border/50 bg-muted/50 p-4 text-left">
                <p className="font-medium">Next Steps:</p>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-medium text-primary">1.</span>
                    <span>AI will analyze your campaign and documents</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-primary">2.</span>
                    <span>DAO members will review the AI findings</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-primary">3.</span>
                    <span>Community voting will determine approval</span>
                  </li>
                </ol>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/campaigns")}
                >
                  View Campaigns
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}
