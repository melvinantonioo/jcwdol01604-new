"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/layouts/Container";
import axiosInstance from "@/lib/AxiosInstance";
import ListingHead from "./ListingHead";
import ListingInfo from "./ListingInfo";
import { categories } from "@/components/CategoryBox/Categories";

interface Property {
    id: string;
    name: string;
    description: string;
    location: string;
    basePrice: number;
    category: string;
    tenant: { id: number; name: string; email: string, role: string; };
    rooms: { id: number; name: string; maxGuests: number }[];
    imageUrl: string;
}

const ListingDetail = () => {
    const { propertyId } = useParams(); // Ambil propertyId dari URL
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/property/${propertyId}`);
                console.log(response);
                setProperty(response.data);
            } catch (error) {
                console.error("Error fetching property details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (propertyId) {
            fetchPropertyDetails();
        }
    }, [propertyId]);

    if (loading) {
        return <p className="text-center text-lg font-semibold py-8">Loading...</p>;
    }

    if (!property) {
        return <p className="text-center text-lg font-semibold py-8">Properti tidak ditemukan.</p>;
    }

    // Temukan kategori yang cocok dari daftar kategori
    const category = categories.find((item) => item.label === property.category);

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={property.name}
                        imageSrc={property.imageUrl || "/default.avif"}
                        locationValue={property.location}
                        id={property.id}
                        currentUser={null} // Jika ada user yang login, bisa diambil dari auth store
                    />
                    <ListingInfo
                        user={property.tenant} // Informasi pemilik properti
                        category={category}
                        description={property.description}
                        roomCount={property.rooms.length}
                        guestCount={property.rooms.reduce((acc, room) => acc + room.maxGuests, 0)}
                        locationValue={property.location}
                        bathroomCount={property.rooms.length} // Asumsi: Setiap kamar punya 1 kamar mandi
                    />
                </div>
            </div>
        </Container>
    );
};

export default ListingDetail;
