"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import ReviewCard from "@/utils/Review/index";
import Empty from "@/utils/EmptyHandler";
import { Review } from "@/types/property";

interface ReviewsListProps {
    propertyId: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ propertyId }) => {
    const [reviews, setReviews] = useState<Review[]>([]); // ✅ Beri tipe Review[]
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get(`/api/reviews/${propertyId}`);
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [propertyId]);

    if (loading) return <p className="text-center">Loading...</p>;

    if (reviews.length === 0) return <Empty title="Belum ada review" />;

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    );
};

export default ReviewsList;
