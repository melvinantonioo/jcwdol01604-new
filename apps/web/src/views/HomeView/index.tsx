"use client";
import PropertyCard from '@/components/Properties/PropertyCard';
import ClientCompopnent from '@/layouts/ClientComponent';
import Container from '@/layouts/Container';
import axiosInstance from '@/lib/AxiosInstance';
import Carousel from '@/utils/Carousel';
import Empty from '@/utils/EmptyHandler';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchResult from '../SearchResultView';
import { PropertyTypes } from '@/types/property';
import Swal from 'sweetalert2';

interface Property {
    id: number;
    name: string;
    location: string;
    region: string;
    basePrice: number;
    rating: number;
    imageUrl: string;
    reviews?: { rating: number }[]; 
    slug: string;
}

export default function HomeViews() {
    const searchParams = useSearchParams();
    const nameParam = searchParams.get("name");
    const locationParam = searchParams.get("location");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const categoryIdParam = searchParams.get("categoryId");
    const sortParam = searchParams.get("sort");
    const category = searchParams.get("category");

    const isSearching = (
        nameParam ||
        locationParam ||
        startDateParam ||
        endDateParam ||
        categoryIdParam ||
        sortParam
    );

    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const bannerImages = [
        '/BannerRoom2.jpg',
        '/BannerRoom4.jpg',
    ];
    const bannerImages2 = [
        '/BannerRoom.jpg',
        '/BannerRoom3.jpg',
    ];

    useEffect(() => {
        const checkEmailVerification = async () => {
            try {
                const response = await axiosInstance.get("/profile/getEmail");
                const user = response.data;

                if (!user.emailVerified) {
                    Swal.fire({
                        title: "Verifikasi Email",
                        text: "Akun Anda belum diverifikasi. Silakan cek email Anda untuk verifikasi.",
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
            } catch (error) {
                console.error("Error checking email verification:", error);
            }
        };

        checkEmailVerification();
    }, []);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                let url = "/property/properties";
                if (category) {
                    url = `/property/properties/category?category=${category}`;
                }

                const response = await axiosInstance.get(url, {
                    params: { page, limit: 10 },
                });

                setProperties(response.data.properties || []);
                console.log("data property HomePage", response.data.properties)
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [isSearching, category, page]); 

    const isEmpty = !loading && (!properties || properties.length === 0);

    if (loading) {
        return (
            <ClientCompopnent>
                <p className="text-center text-lg font-semibold py-8">Loading...</p>
            </ClientCompopnent>
        );
    }


    if (isEmpty) {
        return (
            <ClientCompopnent>
                <Empty showReset />
            </ClientCompopnent>
        )
    }

    return (
        <ClientCompopnent>
            <Container>
                {/* Carousel */}
                <Carousel banners={bannerImages} />

                {isSearching ? (
                    <SearchResult />
                ) : (
                    <div
                        className="
                pt-24
                grid
                grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                xl:grid-cols-5 2xl:grid-cols-6
                gap-6
            "
                    >
                        {properties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                id={property.id}
                                name={property.name}
                                location={property.location}
                                region={property.region}
                                price={property.basePrice}
                                rating={property.rating}
                                imageUrl={property.imageUrl || "/default.avif"}
                                slug={property.slug}
                            />
                        ))}
                    </div>
                )}

                <div className="flex justify-center items-center gap-4 mt-6 pb-6">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300" : "bg-zinc-500 text-white"}`}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded ${page === totalPages ? "bg-gray-300" : "bg-zinc-500 text-white"}`}
                    >
                        Next
                    </button>
                </div>

                <Carousel banners={bannerImages2} />

            </Container>
        </ClientCompopnent>
    )
};
