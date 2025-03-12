"use client";

import { FaStar } from "react-icons/fa";

interface ReviewCardProps {
    review: {
        id: number;
        user: { name: string };
        rating: number;
        comment?: string;
        createdAt: string;
    };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    return (
        <div className="border p-4 rounded-lg shadow-md bg-white">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">{review.user.name}</h3>
                <div className="flex items-center">
                    {Array.from({ length: review.rating }).map((_, i) => (
                        <FaStar key={i} className="text-yellow-500" />
                    ))}
                </div>
            </div>
            <p className="text-gray-500 text-sm">
                {new Date(review.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2 text-gray-700">{review.comment || "Tidak ada komentar"}</p>
        </div>
    );
};

export default ReviewCard;
