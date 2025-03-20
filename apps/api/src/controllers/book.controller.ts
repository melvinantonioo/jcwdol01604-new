import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const bookRoom = async (req: Request, res: Response) => {
    try {
        const { userId, roomId, startDate, endDate } = req.body;

        if (!userId || !roomId || !startDate || !endDate) {
            return res.status(400).json({ message: "Semua field wajib diisi" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            return res.status(400).json({ message: "Tanggal check-out harus setelah check-in" });
        }

        const availability = await prisma.roomAvailability.findMany({
            where: {
                roomId: roomId,
                date: { gte: start, lte: end },
                isAvailable: true,
            },
        });

        const daysRequested = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

        if (availability.length < daysRequested) {
            return res.status(400).json({ message: "Kamar tidak tersedia di tanggal yang dipilih" });
        }

        const room = await prisma.room.findUnique({ where: { id: roomId } });

        if (!room) {
            return res.status(404).json({ message: "Kamar tidak ditemukan" });
        }

        const totalPrice = room.price * daysRequested;

        const booking = await prisma.booking.create({
            data: {
                userId: userId,
                roomId: roomId,
                startDate: start,
                endDate: end,
                status: "WAITING_PAYMENT",
                totalPrice: totalPrice,
            },
        });

        res.status(201).json({ message: "Booking berhasil dibuat", booking });
    } catch (error) {
        console.error("Error booking room:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat booking" });
    }
};
