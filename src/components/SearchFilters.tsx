"use client"

import { useState } from "react"
import { useDogContext } from "@/context/DogContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export default function SearchFilters() {
    const { breeds, searchParams, setSearchParams, fetchDogs } = useDogContext()
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async () => {
        setIsSearching(true)
        await fetchDogs()
        setIsSearching(false)
    }

    return (
        <div className="space-y-4 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
            <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Select
                    value={searchParams.breeds.length > 0 ? searchParams.breeds[0] : "all"}
                    onValueChange={(value) => setSearchParams({ ...searchParams, breeds: value === "all" ? [] : [value] })}
                >
                    <SelectTrigger id="breed">
                        <SelectValue placeholder="Select a breed" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Breeds</SelectItem>
                        {breeds.sort().map((breed) => (
                            <SelectItem key={breed} value={breed}>
                                {breed}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="ageMin">Minimum Age</Label>
                <Input
                    id="ageMin"
                    type="number"
                    min="0"
                    value={searchParams.ageMin}
                    onChange={(e) => setSearchParams({ ...searchParams, ageMin: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="ageMax">Maximum Age</Label>
                <Input
                    id="ageMax"
                    type="number"
                    min="0"
                    value={searchParams.ageMax}
                    onChange={(e) => setSearchParams({ ...searchParams, ageMax: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="sortBy">Sort By</Label>
                <Select value={searchParams.sort} onValueChange={(value) => setSearchParams({ ...searchParams, sort: value })}>
                    <SelectTrigger id="sortBy">
                        <SelectValue placeholder="Select sorting" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="breed:asc">Breed (A-Z)</SelectItem>
                        <SelectItem value="breed:desc">Breed (Z-A)</SelectItem>
                        <SelectItem value="age:asc">Age (Youngest First)</SelectItem>
                        <SelectItem value="age:desc">Age (Oldest First)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleSearch} className="w-full bg-green-600 hover:bg-green-700" disabled={isSearching}>
                {isSearching ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                    </>
                ) : (
                    "Search"
                )}
            </Button>
        </div>
    )
}

