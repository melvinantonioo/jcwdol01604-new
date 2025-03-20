import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getBookingsWithProof = async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: { select: { name: true, email: true } },
                room: { include: { property: { select: { name: true } } } },
                paymentProof: { select: { proofUrl: true } }, 
            },
        });

        return res.status(200).json(bookings);
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        if (!["PAYMENT_CONFIRMED", "CANCELLED"].includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        const booking = await prisma.booking.update({
            where: { id: parseInt(bookingId) },
            data: { status },
        });

        return res.status(200).json({ message: `Booking status updated to ${status}`, booking });
    } catch (error) {
        console.error("❌ Error updating booking status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};