"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDogContext } from "@/context/DogContext"
import { Loader2 } from "lucide-react"

interface Dog {
    id: string
    img: string
    name: string
    age: number
    zip_code: string
    breed: string
}

interface DogCardProps {
    dog: Dog
}

export default function DogCard({ dog }: DogCardProps) {
    const { favorites, addFavorite, removeFavorite } = useDogContext()
    const [isLoading, setIsLoading] = useState(false)
    const isFavorite = favorites.some((favDog) => favDog.id === dog.id)

    const handleFavoriteToggle = async () => {
        setIsLoading(true)
        if (isFavorite) {
            removeFavorite(dog.id)
        } else {
            addFavorite(dog)
        }
        setIsLoading(false)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{dog.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-square relative mb-4">
                    <Image src={dog.img || "/placeholder.svg"} alt={dog.name} fill className="object-cover rounded-md" />
                </div>
                <p>
                    <strong>Breed:</strong> {dog.breed}
                </p>
                <p>
                    <strong>Age:</strong> {dog.age} years
                </p>
                <p>
                    <strong>Zip Code:</strong> {dog.zip_code}
                </p>
                <Button
                    className={`w-full mt-4 ${isFavorite ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
                    onClick={handleFavoriteToggle}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isFavorite ? "Removing..." : "Adding..."}
                        </>
                    ) : isFavorite ? (
                        "Remove from Favorites"
                    ) : (
                        "Add to Favorites"
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}

