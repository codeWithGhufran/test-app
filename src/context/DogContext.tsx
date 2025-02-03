"use client";

import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { makeRequest } from "@/utils/api";

interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}

interface DogContextType {
    dogs: Dog[];
    favorites: Dog[];
    breeds: string[];
    loading: boolean;
    error: string | null;
    searchParams: {
        breeds: string[];
        ageMin: string;
        ageMax: string;
        sort: string;
    };
    setSearchParams: React.Dispatch<React.SetStateAction<{
        breeds: string[];
        ageMin: string;
        ageMax: string;
        sort: string;
    }>>;
    addFavorite: (dog: Dog) => void;
    removeFavorite: (dogId: string) => void;
    fetchDogs: () => Promise<void>;
    loadMoreDogs: () => Promise<void>;
    generateMatch: () => Promise<Dog | null>;
    hasMore: boolean;
}

const DogContext = createContext<DogContextType | undefined>(undefined);

export const useDogContext = () => {
    const context = useContext(DogContext);
    if (!context) {
        throw new Error("useDogContext must be used within a DogProvider");
    }
    return context;
};

export const DogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [favorites, setFavorites] = useState<Dog[]>([]);
    const [breeds, setBreeds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useState<{
        breeds: string[]
        ageMin: string
        ageMax: string
        sort: string
    }>({
        breeds: [],
        ageMin: "",
        ageMax: "",
        sort: "breed:asc",
    })

    const fetchBreeds = useCallback(async () => {
        try {
            const data = await makeRequest<string[]>({ url: "/dogs/breeds", method: "GET" });
            setBreeds(data);
        } catch (error) {
            console.error("Error fetching breeds:", error);
            setError("Failed to fetch breeds. Please try again later.");
        }
    }, []);

    const fetchDogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const searchResponse = await makeRequest<{ resultIds: string[]; total: number; next: string | null }>({
                url: "/dogs/search",
                method: "GET",
                params: {
                    ...searchParams,
                    //size: 12,
                    breeds: searchParams.breeds.length > 0 ? searchParams.breeds : undefined,
                },
            });
            const dogIds = searchResponse.resultIds;
            const dogsResponse = await makeRequest<Dog[]>({
                url: "/dogs",
                method: "POST",
                data: dogIds,
            });
            setDogs(dogsResponse);
            setNextCursor(searchResponse.next);
            setHasMore(!!searchResponse.next);
        } catch (error) {
            console.error("Error fetching dogs:", error);
            setError("Failed to fetch dogs. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    const loadMoreDogs = useCallback(async () => {
        // if (!nextCursor) return;

        setLoading(true);
        setError(null);
        try {
            const searchResponse = await makeRequest<{ resultIds: string[]; total: number; next: string | null }>({
                url: "/dogs/search",
                method: "GET",
                params: {
                    ...searchParams,
                    size: 12,
                    from: nextCursor,
                },
            });
            const dogIds = searchResponse.resultIds;
            const dogsResponse = await makeRequest<Dog[]>({
                url: "/dogs",
                method: "POST",
                data: dogIds,
            });

            setDogs((prevDogs) => [...prevDogs, ...dogsResponse]);
            setNextCursor(searchResponse.next);
            setHasMore(!!searchResponse.next);
        } catch (error) {
            console.error("Error fetching more dogs:", error);
            setError("Failed to fetch more dogs. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [nextCursor, searchParams]);

    useEffect(() => {
        const initializeDogs = async () => {
            await fetchBreeds();
            await fetchDogs();
        };
        initializeDogs();
    }, [fetchBreeds, fetchDogs]);

    const addFavorite = (dog: Dog) => {
        setFavorites((prev) => [...prev, dog]);
    };

    const removeFavorite = (dogId: string) => {
        setFavorites((prev) => prev.filter((dog) => dog.id !== dogId));
    };

    const generateMatch = async (): Promise<Dog | null> => {
        try {
            const favoriteIds = favorites.map((dog) => dog.id);
            const response = await makeRequest<{ match: string }>({
                url: "/dogs/match",
                method: "POST",
                data: favoriteIds,
            });
            const matchedDog = dogs.find((dog) => dog.id === response.match);
            return matchedDog || null;
        } catch (error) {
            console.error("Error generating match:", error);
            setError("Failed to generate match. Please try again later.");
            return null;
        }
    };

    return (
        <DogContext.Provider
            value={{
                dogs,
                favorites,
                breeds,
                loading,
                error,
                searchParams,
                setSearchParams,
                addFavorite,
                removeFavorite,
                fetchDogs,
                loadMoreDogs,
                generateMatch,
                hasMore,
            }}
        >
            {children}
        </DogContext.Provider>
    );
};
