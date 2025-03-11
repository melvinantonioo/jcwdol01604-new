"use client";
import useAuthStore from "@/stores/AuthStores";
import HeartButton from "@/utils/HeartButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";

interface PropertyCardProps {
    id: number;
    name: string;
    location: string;
    region: string;
    price: number;
    distance?: number;
    rating: number;
    imageUrl: string;
    availableDates?: string;
    slug: string;     // Tambahkan slug
}

const PropertyCard: React.FC<PropertyCardProps> = ({
    id,
    name,
    location,
    region,
    price,
    rating,
    imageUrl,
    availableDates,
    slug //tambah field slug 
}) => {
    const router = useRouter();
    const { user, clearAuth } = useAuthStore(); //zustand

    return (
        <div
            onClick={() => router.push(`/property/${slug}`)} 
            className="bg-white shadow-md rounded-lg overflow-hidden transition hover:scale-105">
            {/* Gambar Properti */}
            <div className="relative w-full h-60">
                <Image
                    src={imageUrl || "/Banner1.avif"}
                    alt={name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                />
            </div>
            <div>
                <HeartButton
                    listingId={"1"}
                    currentUser={user}
                />
            </div>

            {/* Konten */}
            <div className="p-4">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-gray-500 text-sm">{location},{region}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-500 mt-1">
                    <FaStar />
                    <span className="text-sm font-medium">{rating}</span>
                </div>

                {/* Harga */}
                <p className="text-lg font-bold mt-2">Rp{price.toLocaleString()} / malam</p>
                {availableDates && <p className="text-sm text-gray-500">{availableDates}</p>}
            </div>
        </div>
    );
};

export default PropertyCard;