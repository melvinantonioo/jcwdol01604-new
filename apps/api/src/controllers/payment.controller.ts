import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const payBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { proofUrl } = req.body;

        if (!proofUrl) {
            return res.status(400).json({ message: "Bukti pembayaran wajib diisi." });
        }

        const paymentProof = await prisma.paymentProof.create({
            data: {
                bookingId: Number(id),
                proofUrl,
            },
        });

        await prisma.booking.update({
            where: { id: Number(id) },
            data: { status: "WAITING_PAYMENT" },
        });

        return res.json({ message: "Pembayaran berhasil dikirim.", paymentProof });
    } catch (error) {
        console.error("Error processing payment:", error);
        return res.status(500).json({ message: "Gagal memproses pembayaran." });
    }
};
