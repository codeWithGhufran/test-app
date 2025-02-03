"use client"

import { useState } from "react"
import { useDogContext } from "@/context/DogContext"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import DogCard from "./DogCard"


export default function FavoritesList() {
    const { favorites, generateMatch } = useDogContext()
    const [matchedDog, setMatchedDog] = useState<any | null>(null)
    const [isGeneratingMatch, setIsGeneratingMatch] = useState(false)

    const handleGenerateMatch = async () => {
        setIsGeneratingMatch(true)
        try {
            const match = await generateMatch()
            setMatchedDog(match)
        } catch (error) {
            console.error("Error generating match:", error)
        } finally {
            setIsGeneratingMatch(false)
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow mt-8">
            <h2 className="text-xl font-semibold mb-4">Favorites</h2>
            <ScrollArea className="h-48 mb-4">
                <ul className="space-y-2">
                    {favorites.map((dog) => (
                        <li key={dog.id}>{dog.name}</li>
                    ))}
                </ul>
            </ScrollArea>
            <Button
                onClick={handleGenerateMatch}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isGeneratingMatch || favorites.length === 0}
            >
                {isGeneratingMatch ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Match...
                    </>
                ) : (
                    "Generate Match"
                )}
            </Button>
            {matchedDog && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Your Match:</h3>
                    <DogCard dog={matchedDog} />
                </div>
            )}
        </div>
    )
}

