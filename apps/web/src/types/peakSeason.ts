export interface PeakSeasonType {
    id: number;
    roomId: number;
    startDate: string;  // Pakai string karena API biasanya return ISO string
    endDate: string;
    priceAdjustment?: number;
    percentageAdjustment?: number;
    room: {
        id: number;
        name: string;
        property: {
            id: number;
            name: string;
        };
    };
}