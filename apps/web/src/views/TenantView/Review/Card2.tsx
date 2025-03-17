import React from "react";

interface ReviewCardProps {
    review: {
        id: number;
        rating: number;
        comment: string;
        createdAt: string;
        user: { name: string; profilePicture?: string };
        property: { id: number; name: string };
    };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    return (
        <div className="border p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
                <img
                    src={review.user.profilePicture || "/default-profile.png"}
                    alt={review.user.name}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <h2 className="font-bold">{review.user.name}</h2>
                    <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            <p className="mt-2 text-lg font-semibold">⭐ {review.rating}/5</p>
            <p className="text-gray-600">{review.comment}</p>
            <p className="text-sm text-gray-500 mt-2">Review untuk: {review.property.name}</p>
        </div>
    );
};

export default ReviewCard;