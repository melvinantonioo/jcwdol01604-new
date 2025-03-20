"use client";

import { FaStar } from "react-icons/fa";

interface ReviewCardProps {
    review: {
        id: number;
        rating: number;
        comment: string;
        createdAt: string;
        user: { name: string };
        property?: { id: number; name: string }; 
    };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    return (
        <div className="p-4 border rounded-lg shadow-md bg-white">
            <div className="flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                <span className="font-bold text-gray-800">{review.rating}/5</span>
            </div>
            <p className="text-sm text-gray-600">{review.comment}</p>
            <p className="text-xs text-gray-500 mt-2">
                Oleh <span className="font-semibold">{review.user.name}</span> pada{" "}
                {new Date(review.createdAt).toLocaleDateString()}
            </p>
            {review.property && (
                <p className="text-xs text-gray-400">Untuk properti: {review.property.name}</p>
            )}
        </div>
    );
};

export default ReviewCard;
