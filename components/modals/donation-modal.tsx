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
import { useUSDCApproval } from "@/hooks/use-usdc-approval"
import { useDonate } from "@/hooks/use-donate"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses"
import { toast } from "sonner"

interface DonationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: string
  campaignTitle: string
  campaignAddress: `0x${string}`
}

export function DonationModal({
  open,
  onOpenChange,
  amount,
  campaignTitle,
  campaignAddress,
}: DonationModalProps) {
  const { needsApproval, approve, confirming: approving } = useUSDCApproval(
    campaignAddress,
    amount || "0"
  )

  const {
    donate,
    isPending: isDonating,
    isConfirming: isConfirmingDonation,
    isSuccess,
    hash,
  } = useDonate(campaignAddress)

  const handleAction = async () => {
    try {
      if (needsApproval) {
        approve()
      } else {
        donate(amount)
      }
    } catch (err: any) {
      toast.error(err.message || "Action failed")
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const isLoading = approving || isDonating || isConfirmingDonation

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
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
            {hash && (
              <div className="mt-6 rounded-lg border border-border/50 bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Transaction Hash</p>
                <p className="mt-1 font-mono text-sm break-all">
                  {hash}
                </p>
              </div>
            )}
            <Button onClick={handleClose} className="mt-6 w-full">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{needsApproval ? "Approve USDC" : "Confirm Donation"}</DialogTitle>
              <DialogDescription>
                {needsApproval
                  ? "You need to approve USDC spending before donating."
                  : "You are about to donate to this campaign"}
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
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleAction} className="gap-2" disabled={isLoading}>
                {isLoading ? (
                   <>
                     <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                     </svg>
                     {approving ? "Approving..." : "Donating..."}
                   </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                    </svg>
                    {needsApproval ? "Approve USDC" : "Donate Now"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
