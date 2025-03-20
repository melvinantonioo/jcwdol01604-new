import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkRoomAvailability = async (req: Request, res: Response) => {
    try {
        const { roomId, startDate, endDate } = req.body;

        if (!roomId || !startDate || !endDate) {
            return res.status(400).json({ message: "Room ID, startDate, dan endDate wajib diisi." });
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (parsedStartDate >= parsedEndDate) {
            return res.status(400).json({ message: "Tanggal check-out harus setelah check-in." });
        }

        const conflictingBooking = await prisma.booking.findFirst({
            where: {
                roomId: Number(roomId),
                status: { not: "CANCELLED" },
                OR: [
                    { startDate: { lt: parsedEndDate }, endDate: { gt: parsedStartDate } },
                ],
            },
        });


        const roomAvailability = await prisma.roomAvailability.findMany({
            where: {
                roomId: Number(roomId),
                date: { gte: parsedStartDate, lte: parsedEndDate },
                isAvailable: false, 
            },
        });


        if (conflictingBooking || roomAvailability.length > 0) {
            return res.json({ isAvailable: false, message: "Kamar tidak tersedia pada tanggal yang dipilih." });
        }

        return res.json({ isAvailable: true, message: "Kamar tersedia pada tanggal yang dipilih." });
    } catch (error) {
        console.error("❌ Error checking room availability:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat mengecek ketersediaan kamar." });
    }
};
