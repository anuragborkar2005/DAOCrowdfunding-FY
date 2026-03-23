"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useUser } from "@/context/user-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AppKitButton } from "@reown/appkit/react"
import ConnectButton from "./ui/connect-button"

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-primary-foreground"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <span className="text-xl font-bold">FundMitra</span>
    </Link>
  )
}

function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-9 w-9"
    >
      <svg
        className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      <svg
        className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

function WalletIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}

const allNavItems = [
  { href: "/campaigns", label: "Explore", requiresAuth: false },
  {
    href: "/create",
    label: "Start Campaign",
    requiresAuth: true,
    roles: ["creator", "admin"],
  },
  {
    href: "/dao",
    label: "DAO Voting",
    requiresAuth: true,
    roles: ["dao_member", "admin"],
  },
  { href: "/transparency", label: "Transparency", requiresAuth: true },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const { userRole, userName, logout } = useUser()

  // Filter navigation items based on authentication and role
  const getVisibleNavItems = () => {
    return allNavItems.filter((item) => {
      if (!item.requiresAuth) {
        return true // Always show items that don't require auth
      }
      if (!userRole) {
        return false // Hide auth-required items when not signed in
      }
      // Show all auth-required items if no specific roles are defined, or if user role matches
      if (!item.roles) {
        return true
      }
      return item.roles.includes(userRole)
    })
  }

  const visibleNavItems = getVisibleNavItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-2 sm:flex">
            {userRole ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button size="sm" variant="outline">
                        {userName} ({userRole.replace("_", " ")})
                      </Button>
                    }
                  ></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      render={<Link href="/profile">Profile</Link>}
                    ></DropdownMenuItem>
                    {userRole === "dao_member" && (
                      <DropdownMenuItem
                        render={
                          <Link href="/dao-verification">DAO Verification</Link>
                        }
                      ></DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        logout()
                        window.location.href = "/auth"
                      }}
                      className="text-destructive"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <DropdownMenu>
                  {/* <DropdownMenuTrigger
                    render={
                      <Button size="sm" className="gap-2">
                        <WalletIcon />
                        Connect Wallet
                      </Button>
                    }
                  /> */}
                  {/* <Button className="w-full gap-2">
                        <WalletIcon />
                        Connect Wallet
                      </Button> */}
                  <ConnectButton />

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 35 33" fill="none">
                        <path
                          d="M32.9 1L19.4 11.4l2.5-5.9L32.9 1z"
                          fill="#E2761B"
                          stroke="#E2761B"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 1l13.4 10.5-2.4-5.9L2 1z"
                          fill="#E4761B"
                          stroke="#E4761B"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      MetaMask
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.5-.8.7-1.3.5l-2.9-1.8-2.2 1.9c-.3.3-.8.1-.8-.3v-2.6l4.7-4.2c.2-.2 0-.5-.3-.4l-5.8 3.6-2.5-1.5c-.5-.3-.5-1 0-1.4l10-3.9c.4-.2.9.1.9.5l-1.7 9.1c-.1.2-.1.4-.1.5z" />
                      </svg>
                      WalletConnect
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      Coinbase Wallet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              className="md:hidden"
              render={
                <Button variant="ghost" size="icon">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              }
            />
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 pt-6">
                <nav className="flex flex-col gap-2">
                  {visibleNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 border-t border-border pt-4">
                  {userRole ? (
                    <>
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          logout()
                          setIsOpen(false)
                          window.location.href = "/auth"
                        }}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      {/* <Button className="w-full gap-2">
                        <WalletIcon />
                        Connect Wallet
                      </Button> */}
                      <ConnectButton />
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
