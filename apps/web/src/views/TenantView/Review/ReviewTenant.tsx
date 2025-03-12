"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import Empty from "@/utils/EmptyHandler";
import ReviewCard from "./Card";

interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    user: { name: string };
    property: { id: number; name: string };
}

const TenantReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/api/reviews/tenant"); 
                console.log("Data Review Tenant",response.data) 
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching tenant reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) return <p className="text-center text-lg font-semibold py-8">Loading...</p>;
    if (!reviews.length) return <Empty title="Belum ada review" subtitle="Properti Anda belum memiliki review" />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    );
};

export default TenantReviews;
