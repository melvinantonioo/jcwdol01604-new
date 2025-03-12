export interface PropertyTypes {
    id: number;
    name: string;
    location: string;
    region:string
    basePrice: number;
    rating?: number;
    imageUrl: string;
    availableDates?: string;
    slug: string;
    description?: string;
};

export interface Review {
    id: number;
    user: {
        id: number;
        name: string;
    };
    rating: number;
    comment?: string;
    createdAt: string;
}