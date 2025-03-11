"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import PropertyCard from "@/components/Properties/PropertyCard";
import Empty from "@/utils/EmptyHandler";

interface SearchProperty {
    id: number;
    slug: string;
    name: string;
    location?: string;
    basePrice: number;
    rating?: number;
    imageUrl?: string;
    lowestRoomPrice?: number; // Jika ingin menampilkan kalkulasi "lowestRoomPrice"
}

export default function SearchResult() {
    const searchParams = useSearchParams();

    // State untuk data properti hasil pencarian
    const [searchProperties, setSearchProperties] = useState<SearchProperty[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSearch = async () => {
            try {
                setLoading(true);

                // Ambil param dari URL, misal: name, location, categoryId, startDate, endDate, sort
                const name = searchParams.get("name") || "";
                const location = searchParams.get("location") || "";
                const categoryId = searchParams.get("categoryId") || "";
                const startDate = searchParams.get("startDate") || "";
                const endDate = searchParams.get("endDate") || "";
                const sort = searchParams.get("sort") || "";

                // Bangun query string
                // (Hanya masukkan key jika nilainya tidak kosong)
                const query = new URLSearchParams();
                if (name) query.set("name", name);
                if (location) query.set("location", location);
                if (categoryId) query.set("categoryId", categoryId);
                if (startDate) query.set("startDate", startDate);
                if (endDate) query.set("endDate", endDate);
                if (sort) query.set("sort", sort);

                // Panggil endpoint /property/search
                const url = `/property/search?${query.toString()}`;
                const { data } = await axiosInstance.get(url);

                // data = { currentPage, pageSize, totalItems, totalPages, data: [ ... ] }
                setSearchProperties(data.data || []);
            } catch (error) {
                console.error("Error fetching search result:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearch();
    }, [searchParams]);

    // Jika loading
    if (loading) {
        return <p className="text-center text-lg font-semibold py-8">Loading...</p>;
    }

    // Jika tidak ada hasil
    if (!searchProperties || searchProperties.length === 0) {
        return <Empty showReset />;
    }

    // Tampilkan hasil
    return (
        <div
            className="
        pt-24
        grid
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
        gap-6
      "
        >
            {searchProperties.map((property) => (
                <PropertyCard
                    key={property.id}
                    id={property.id}
                    slug={property.slug}
                    name={property.name}
                    location={property.location || ""}
                    price={property.lowestRoomPrice || property.basePrice}
                    rating={property.rating || 0}
                    imageUrl={property.imageUrl || "/default.avif"}
                />
            ))}
        </div>
    );
}