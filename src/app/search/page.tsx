"use client"

import { useState } from "react"
import Header from "@/components/Header"
import SearchFilters from "@/components/SearchFilters"
import DogList from "@/components/DogList"
import Pagination from "@/components/Pagination"
import FavoritesList from "@/components/FavoritesList"

export default function SearchPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 10

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <SearchFilters />
                        <FavoritesList />
                    </div>
                    <div className="md:col-span-3">
                        <DogList />
                        {/* <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        /> */}
                    </div>
                </div>
            </main>
        </div>
    )
}

