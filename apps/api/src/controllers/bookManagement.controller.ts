import { Request, Response } from "express";
import prisma from "@/prisma";

export const getTenantBookings = async (req: Request, res: Response) => {
    try {
        const { id: tenantId } = req.user as { id: number };
        const { search, dateRange, page = 1, limit = 10 } = req.query;

        const pageNum = parseInt(page as string, 10) || 1;
        const sizeNum = parseInt(limit as string, 10) || 10;
        const skip = (pageNum - 1) * sizeNum;

        let whereClause: any = {
            room: {
                property: { tenantId },
            },
        };

        // Filter berdasarkan nama user atau email
        if (search) {
            whereClause.user = {
                OR: [
                    { name: { contains: search as string, mode: "insensitive" } },
                    { email: { contains: search as string, mode: "insensitive" } },
                ],
            };
        }

        // Filter berdasarkan rentang tanggal booking
        if (dateRange) {
            const startDate = new Date(dateRange as string);
            whereClause.startDate = { gte: startDate };
        }

        const [totalItems, bookings] = await prisma.$transaction([
            prisma.booking.count({ where: whereClause }),
            prisma.booking.findMany({
                where: whereClause,
                include: {
                    user: { select: { name: true, email: true } },
                    room: { include: { property: true } },
                    paymentProof: true,
                },
                skip,
                take: sizeNum,
                orderBy: { createdAt: "desc" },
            }),
        ]);

        return res.json({
            bookings,
            totalItems,
            totalPages: Math.ceil(totalItems / sizeNum),
            currentPage: pageNum,
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ message: "Gagal mengambil data booking." });
    }
};



export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const { id: userId } = req.user as { id: number };

        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                room: {
                    include: { property: true }, // Sertakan properti
                },
                paymentProof: true,
            },
        });

        return res.json({ bookings });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return res.status(500).json({ message: "Gagal mengambil data booking." });
    }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["PAYMENT_CONFIRMED", "CANCELLED"].includes(status)) {
            return res.status(400).json({ message: "Status tidak valid." });
        }

        const booking = await prisma.booking.update({
            where: { id: Number(id) },
            data: { status },
        });

        return res.json({ message: `Booking ${status}`, booking });
    } catch (error) {
        console.error("Error updating booking status:", error);
        return res.status(500).json({ message: "Gagal memperbarui status booking." });
    }
};
