import { create } from "zustand";
import axiosInstance from "@/lib/AxiosInstance";

interface Property {
    id: number;
    name: string;
    description: string;
    location: string;
    basePrice: number;
    category: string;
    tenant: { id: number; name: string; email: string };
    rooms: { id: number; name: string; maxGuests: number }[];
    imageUrl: string;
}

interface PropertyStore {
    property: Property | null;
    fetchProperty: (propertyId: string) => Promise<void>;
}

const usePropertyStore = create<PropertyStore>((set) => ({
    property: null,
    fetchProperty: async (propertyId) => {
        try {
            const response = await axiosInstance.get(`/property/${propertyId}`);
            set({ property: response.data });
        } catch (error) {
            console.error("Error fetching property details:", error);
        }
    },
}));

export default usePropertyStore;
