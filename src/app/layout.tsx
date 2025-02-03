import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { DogProvider } from "@/context/DogContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Fetch Dog Adoption",
  description: "Find your perfect furry friend",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DogProvider>
          {children}
          <Toaster />
        </DogProvider>
      </body>
    </html>
  )
}

