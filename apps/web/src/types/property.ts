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
}