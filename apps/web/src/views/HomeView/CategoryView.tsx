"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PropertyCard from "@/components/Properties/PropertyCard";
import axiosInstance from "@/lib/AxiosInstance";

interface Property {
    id: number;
    name: string;
    location: string;
    basePrice: number;
    rating: number;
    imageUrl: string;
}

const CategoryPage = () => {
    const { categoryId } = useParams(); // Mengambil categoryId dari URL
    const parsedCategoryId = categoryId ? Number(categoryId) : null;
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!parsedCategoryId) return;


        const fetchProperties = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/properties/category?categoryId=${parsedCategoryId}`);
                setProperties(res.data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [parsedCategoryId]);

    if (!parsedCategoryId) return <p>Loading...</p>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Properti dalam Kategori {parsedCategoryId}</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {properties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            id={property.id}
                            name={property.name}
                            location={property.location}
                            price={property.basePrice}
                            rating={property.rating}
                            imageUrl={property.imageUrl}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;