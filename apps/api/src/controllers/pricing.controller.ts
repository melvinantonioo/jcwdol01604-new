import { Request, Response } from "express";
import prisma from "@/prisma";

export const checkPropertyPricing = async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const { startDate, endDate } = req.query;

        if (!propertyId || !startDate || !endDate) {
            return res.status(400).json({ message: "Property ID dan tanggal diperlukan" });
        }

        const property = await prisma.property.findUnique({
            where: { id: parseInt(propertyId) },
            include: {
                rooms: {
                    where: { isAvailable: true }, 
                    include: {
                        peakSeasonRates: true,
                        availability: true,
                    },
                },
            },
        });

        if (!property) {
            return res.status(404).json({ message: "Properti tidak ditemukan" });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        const totalNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        
        const roomsPricing = property.rooms.map((room) => {
            let basePrice = room.price;
            let totalRoomPrice = basePrice * totalNights;
            let priceAdjustments: { date: string; type: string; amount: number }[] = [];

            
            room.peakSeasonRates.forEach((rate) => {
                if (
                    (start >= rate.startDate && start <= rate.endDate) ||
                    (end >= rate.startDate && end <= rate.endDate) ||
                    (start <= rate.startDate && end >= rate.endDate)
                ) {
                    let adjustment = 0;
                    let type = "";

                    if (rate.priceAdjustment) {
                        adjustment = rate.priceAdjustment;
                        type = "Nominal";
                    } else if (rate.percentageAdjustment) {
                        adjustment = (basePrice * rate.percentageAdjustment) / 100;
                        type = "Persentase";
                    }

                    totalRoomPrice += adjustment * totalNights;
                    priceAdjustments.push({
                        date: rate.startDate.toISOString().split("T")[0],
                        type,
                        amount: adjustment,
                    });
                }
            });

            return {
                roomId: room.id,
                roomName: room.name,
                basePrice,
                totalRoomPrice,
                priceAdjustments,
            };
        });

        return res.status(200).json({
            available: roomsPricing.length > 0,
            totalNights,
            roomsPricing,
            message: `Harga kamar untuk ${property.name} selama ${totalNights} malam`,
        });
    } catch (error) {
        console.error("❌ Error checking property pricing:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat mengecek harga" });
    }
};