"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type React from "react" // Added import for React

export default function LoginForm() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await axios.post(
                "https://frontend-take-home-service.fetch.com/auth/login",
                { name, email },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    timeout: 10000, // Set a 10-second timeout
                },
            )
            if (response.status === 200) {
                router.push("/search")
            } else {
                throw new Error("Login failed")
            }
        } catch (error) {
            console.error("Login error:", error)
            let errorMessage = "An unexpected error occurred. Please try again."
            if (axios.isAxiosError(error)) {
                if (error.code === "ECONNABORTED") {
                    errorMessage = "The request timed out. Please check your internet connection and try again."
                } else if (error.response) {
                    errorMessage = `Server error: ${error.response.status}. Please try again later.`
                } else if (error.request) {
                    errorMessage = "No response received from the server. Please check your internet connection and try again."
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                    </>
                ) : (
                    "Log In"
                )}
            </Button>
        </form>
    )
}

