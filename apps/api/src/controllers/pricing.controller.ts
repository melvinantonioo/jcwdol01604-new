import { Request, Response } from "express";
import prisma from "@/prisma";

// export const checkPropertyPricing = async (req: Request, res: Response) => {
//     try {
//         const { propertyId } = req.params;
//         const { startDate, endDate } = req.query;

//         if (!propertyId || !startDate || !endDate) {
//             return res.status(400).json({ message: "Property ID dan tanggal diperlukan" });
//         }

//         const property = await prisma.property.findUnique({
//             where: { id: parseInt(propertyId) },
//             include: {
//                 rooms: {
//                     where: { isAvailable: true }, // ✅ Hanya kamar yang tersedia
//                     include: {
//                         peakSeasonRates: true,
//                         availability: true,
//                     },
//                 },
//             },
//         });

//         if (!property) {
//             return res.status(404).json({ message: "Properti tidak ditemukan" });
//         }

//         const start = new Date(startDate as string);
//         const end = new Date(endDate as string);
//         const totalNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

//         // ✅ Ambil harga kamar termurah (termasuk peak season jika ada)
//         const lowestRoom = property.rooms.reduce((minRoom, room) => {
//             const roomPrice = room.price;
//             return roomPrice < minRoom.price ? room : minRoom;
//         }, property.rooms[0]);

//         if (!lowestRoom) {
//             return res.status(404).json({ message: "Tidak ada kamar tersedia di properti ini" });
//         }

//         let basePricePerNight = lowestRoom.price;
//         let totalPrice = basePricePerNight * totalNights;
//         let priceAdjustments: { date: string; type: string; amount: number }[] = [];

//         // ✅ Periksa kenaikan harga saat Peak Season
//         lowestRoom.peakSeasonRates.forEach((rate) => {
//             if (
//                 (start >= rate.startDate && start <= rate.endDate) || // Jika start date masuk peak season
//                 (end >= rate.startDate && end <= rate.endDate) || // Jika end date masuk peak season
//                 (start <= rate.startDate && end >= rate.endDate) // Jika start dan end mengandung peak season
//             ) {
//                 let adjustment = 0;
//                 let type = "";

//                 if (rate.priceAdjustment) {
//                     adjustment = rate.priceAdjustment;
//                     type = "Nominal";
//                 } else if (rate.percentageAdjustment) {
//                     adjustment = (basePricePerNight * rate.percentageAdjustment) / 100;
//                     type = "Persentase";
//                 }

//                 totalPrice += adjustment * totalNights;
//                 priceAdjustments.push({
//                     date: rate.startDate.toISOString().split("T")[0],
//                     type,
//                     amount: adjustment,
//                 });
//             }
//         });

//         return res.status(200).json({
//             available: true,
//             totalNights,
//             basePricePerNight,
//             totalPrice,
//             priceAdjustments,
//             message: `Total harga untuk ${property.name} selama ${totalNights} malam adalah Rp ${totalPrice.toLocaleString()} (Harga per malam: Rp ${basePricePerNight.toLocaleString()})`,
//         });
//     } catch (error) {
//         console.error("❌ Error checking property pricing:", error);
//         return res.status(500).json({ message: "Terjadi kesalahan saat mengecek harga" });
//     }
// };

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
                    where: { isAvailable: true }, // ✅ Hanya kamar yang tersedia
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

        // ✅ Ambil harga semua kamar
        const roomsPricing = property.rooms.map((room) => {
            let basePrice = room.price;
            let totalRoomPrice = basePrice * totalNights;
            let priceAdjustments: { date: string; type: string; amount: number }[] = [];

            // ✅ Cek kenaikan harga selama Peak Season
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