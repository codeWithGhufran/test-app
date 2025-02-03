"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import axios from "axios"

export default function Header() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await axios.post("https://frontend-take-home-service.fetch.com/auth/logout", {}, { withCredentials: true })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fetch Dog Adoption</h1>
        <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
          Log Out
        </Button>
      </div>
    </header>
  )
}

