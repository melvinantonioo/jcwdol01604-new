"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import Empty from "@/utils/EmptyHandler";
import ReviewCard from "@/views/TenantView/Review/Card2";
import ProfileLayout from "@/layouts/ProfileLayouts";

interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    user: { name: string; profilePicture?: string };
    property: { id: number; name: string };
}

const UserReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/api/reviews/user");
                setReviews(response.data);
            } catch (error) {
                console.error("❌ Error fetching user reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserReviews();
    }, []);

    if (loading) return <p className="text-center text-lg font-semibold py-8">Loading...</p>;
    if (!reviews.length) return <Empty title="Belum ada review" subtitle="Anda belum memberikan review untuk properti manapun" />;

    return (
        <ProfileLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>
        </ProfileLayout>

    );
};

export default UserReviews;
