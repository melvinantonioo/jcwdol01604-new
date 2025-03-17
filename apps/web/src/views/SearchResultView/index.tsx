"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import Empty from "@/utils/EmptyHandler";
import PropertyCard from "@/components/Properties/PropertyCard";

interface Property {
    id: number;
    name: string;
    location: string;
    basePrice: number;
    rating: number;
    imageUrl: string;
    slug: string;
    lowestRoomPrice?: number;
}

export default function SearchResult() {
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Ambil param2 pencarian
                const name = searchParams.get("name");
                const location = searchParams.get("location");
                const startDate = searchParams.get("startDate");
                const endDate = searchParams.get("endDate");
                const categoryId = searchParams.get("categoryId");
                const sort = searchParams.get("sort");
                const minPrice = searchParams.get("minPrice");
                const maxPrice = searchParams.get("maxPrice");

                console.log("Query Params: ", { location, startDate, endDate, categoryId, sort, minPrice, maxPrice });

                // Bentuk query
                const query = new URLSearchParams();
                if (name) query.set("name", name);
                if (location) query.set("location", location);
                if (startDate) query.set("startDate", startDate);
                if (endDate) query.set("endDate", endDate);
                if (categoryId) query.set("categoryId", categoryId);
                if (sort) query.set("sort", sort);
                // if (minPrice) query.set("minPrice", minPrice);
                // if (maxPrice) query.set("maxPrice", maxPrice);
                if (minPrice) query.set("minPrice", Number(minPrice).toString());
                if (maxPrice) query.set("maxPrice", Number(maxPrice).toString());
                query.set("page", currentPage.toString());
                query.set("pageSize", pageSize.toString());
                
                console.log("🔎 Query Params yang dikirim: ", {
                    location, startDate, endDate, categoryId, sort, minPrice, maxPrice
                });

                
                const url = `/api/search?${query.toString()}`;
                const { data } = await axiosInstance.get(url);

                console.log("Fetching URL:", url);

                setProperties(data.data || []);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching search result:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams, currentPage]);

    if (loading) {
        return <p className="text-center text-lg font-semibold py-8">Loading...</p>;
    }

    if (properties.length === 0) {
        return <Empty showReset />;
    }

    return (
        <div className="pt-24">
            {/* Grid Property */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {properties.map((property) => {
                    const priceToDisplay = property.lowestRoomPrice ?? property.basePrice;
                    return (
                        <PropertyCard
                            key={property.id}
                            id={property.id}
                            name={property.name}
                            location={property.location}
                            region={"belum fetch"}
                            price={priceToDisplay}
                            rating={property.rating}
                            imageUrl={property.imageUrl || "/default.avif"}
                            slug={property.slug}
                        />
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                    Previous
                </button>

                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
