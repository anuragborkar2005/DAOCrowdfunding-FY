import { Geist_Mono, Inter } from "next/font/google"
import { headers } from "next/headers"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import ContextProvider from "@/context"
import "./globals.css"
import { Metadata } from "next"
import { UserProvider } from "@/context/user-context"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "DAO-App",
  description: "Powered by Reown",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerObject = await headers()
  const cookies = headerObject.get("cookie")
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <ContextProvider cookies={cookies}>
            <UserProvider>{children}</UserProvider>
          </ContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
