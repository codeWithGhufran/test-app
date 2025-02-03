"use client";

import { useState } from "react";
import { useDogContext } from "@/context/DogContext";
import DogCard from "./DogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function DogList() {
    const { dogs, loading, error } = useDogContext();
    const [currentPage, setCurrentPage] = useState(1);
    const dogsPerPage = 12;

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    // Calculate the index range for the current page
    const indexOfLastDog = currentPage * dogsPerPage;
    const indexOfFirstDog = indexOfLastDog - dogsPerPage;
    const currentDogs = dogs.slice(indexOfFirstDog, indexOfLastDog);

    // Handle Next and Previous buttons
    const handleNext = () => {
        if (currentPage < Math.ceil(dogs.length / dogsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {loading && [...Array(3)].map((_, index) => <Skeleton key={index} className="h-[300px] w-full" />)}
                {currentDogs.map((dog) => (
                    <DogCard key={dog.id} dog={dog} />
                ))}
            </div>

            <div className="flex justify-between mt-4">
                <Button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                >
                    Previous
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={currentPage * dogsPerPage >= dogs.length}
                    className="flex items-center gap-2"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
