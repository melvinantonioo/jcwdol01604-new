"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/layouts/Container";
import axiosInstance from "@/lib/AxiosInstance";
import ListingHead from "@/components/Listing/ListingHead";
import ListingInfo from "@/components/Listing/ListingInfo";
import { categories } from "@/components/CategoryBox/Categories";
import { usePathname } from "next/navigation";
import ClientCompopnent from "@/layouts/ClientComponent";
import dynamic from "next/dynamic";
import { HomeLayouts } from "@/layouts/HomeLayouts";
import Button from "@/utils/Button";
import BookingModal from "@/components/Modals/BookingModal";
import { fetchGeolocation } from "@/utils/geolocation";  
import CheckPricing from "@/components/Pricing";
import FacilityAndRules from "@/components/Properties/Facility";
import ReviewsList from "@/utils/Review/ReviewList";

const Map2 = dynamic(() => import("@/utils/Map2"), {
    ssr: false,         
});

interface Property {
    id: string;
    name: string;
    description: string;
    location: string;
    region: string;
    basePrice: number;
    category: string;
    tenant: { id: number; name: string; email: string, role: string; };
    rooms: { id: number; name: string; maxGuests: number }[];
    imageUrl: string;
    slug: string;
}

const ListingDetail = () => {
    const pathname = usePathname();
    const { propertyId } = useParams(); 
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const [geoLocation, setGeoLocation] = useState<[number, number] | null>(null); 

    useEffect(() => {
        const slug = pathname?.split("/")[2];
        if (!slug) return;

        const fetchProperty = async () => {
            try {
                setLoading(true);
                
                const { data } = await axiosInstance.get(`/property/slug/${slug}`);
                setProperty(data);

                if (data.location && data.region) {
                    const coords = await fetchGeolocation(data.location, data.region);
                    if (coords !== null) {
                        setGeoLocation(coords as [number, number]); 
                    }
                }
            } catch (error) {
                console.error("Error fetching property detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [pathname]);

    if (loading) {
        return <p className="text-center text-lg font-semibold py-8">Loading...</p>;
    }

    if (!property) {
        return <p className="text-center text-lg font-semibold py-8">Properti tidak ditemukan.</p>;
    }

    const category = categories.find((item) => item.label === property.category);

    return (
        <HomeLayouts>
            <ClientCompopnent>
                <Container>
                    <div className="max-w-screen-lg mx-auto">
                        <div className="flex flex-col gap-6">
                            <ListingHead
                                title={property.name}
                                imageSrc={property.imageUrl || "/default.avif"}
                                locationValue={property.location}
                                id={property.id}
                                currentUser={null} 
                            />
                            
                            <div className="flex justify-center mt-4">
                                <Button
                                    label="Book Now"
                                    onClick={() => setIsBookingModalOpen(true)}
                                />
                            </div>

                            {/* 🔹 Komponen Cek Harga */}
                            <CheckPricing propertyId={property.id} />

                            <ListingInfo
                                user={property.tenant}
                                category={category}
                                description={property.description}
                                roomCount={property.rooms.length}
                                guestCount={property.rooms.reduce((acc, room) => acc + room.maxGuests, 0)}
                                locationValue={property.location}
                                bathroomCount={property.rooms.length}
                            />

                            <FacilityAndRules />

                            {geoLocation ? <Map2 center={geoLocation} /> : <p className="text-gray-500">📍 Lokasi belum tersedia</p>}

                            {/* ✅ Komponen Reviews */}
                            <h2 className="text-xl font-semibold mt-6">Review & Rating</h2>
                            <ReviewsList propertyId={Number(property.id)} />

                            {/* BUTTON BOOKING */}
                            <div className="flex justify-center mt-4">
                                <Button
                                    label="Book Now"
                                    onClick={() => setIsBookingModalOpen(true)}
                                />
                            </div>
                        </div>
                    </div>
                </Container>
                {/* MODAL BOOKING */}
                {property && (
                    <BookingModal
                        isOpen={isBookingModalOpen}
                        onClose={() => setIsBookingModalOpen(false)}
                        property={property}
                    />
                )}
            </ClientCompopnent>
        </HomeLayouts>
    );
};

export default ListingDetail;
