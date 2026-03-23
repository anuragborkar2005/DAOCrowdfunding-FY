"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DonationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: string
  campaignTitle: string
}

type Step = "confirm" | "connecting" | "processing" | "success"

export function DonationModal({
  open,
  onOpenChange,
  amount,
  campaignTitle,
}: DonationModalProps) {
  const [step, setStep] = React.useState<Step>("confirm")

  const handleDonate = async () => {
    setStep("connecting")
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStep("processing")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setStep("success")
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => setStep("confirm"), 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Donation</DialogTitle>
              <DialogDescription>
                You are about to donate to this campaign
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-border/50 bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Campaign</p>
                <p className="font-medium">{campaignTitle}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold text-primary">${amount}</p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">
                      Secured by Smart Contract
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your donation is protected and tracked on the blockchain
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleDonate} className="gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                </svg>
                Connect Wallet
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "connecting" && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-8 w-8 animate-pulse text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Connecting Wallet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Please confirm the connection in your wallet
            </p>
          </div>
        )}

        {step === "processing" && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-8 w-8 animate-spin text-primary"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Processing Transaction</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Please wait while your transaction is being processed
            </p>
            <div className="mt-6 rounded-lg border border-border/50 bg-muted/50 p-4">
              <div className="space-y-2 text-left text-sm">
                <div className="flex items-center gap-2">
                  <svg
                    className="text-success h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Wallet connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="text-success h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Transaction signed</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span className="text-muted-foreground">
                    Confirming on blockchain...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-12 text-center">
            <div className="bg-success/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <svg
                className="text-success h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Donation Successful!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you for your generous contribution of{" "}
              <span className="font-semibold text-primary">${amount}</span>
            </p>
            <div className="mt-6 rounded-lg border border-border/50 bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Transaction Hash</p>
              <p className="mt-1 font-mono text-sm break-all">
                0x7f9c2e8d4a3b1c0e5f6d7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d
              </p>
            </div>
            <Button onClick={handleClose} className="mt-6 w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
