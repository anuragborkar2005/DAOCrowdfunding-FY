import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { Button } from "./button"
import { WalletIcon } from "@phosphor-icons/react"

export default function ConnectButton() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()

  return (
    <Button onClick={() => open()}>
      <WalletIcon />
      {isConnected
        ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
        : "Connect Wallet"}
    </Button>
  )
}
