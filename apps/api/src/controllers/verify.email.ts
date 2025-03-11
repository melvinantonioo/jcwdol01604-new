import { Request, Response } from 'express';
import prisma from '@/prisma';

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query; //menerima token dari query

    if (!token) {
        return res.status(400).json({ message: "Token tidak valid" });
    }

    try {
        const user = await prisma.user.findFirst({
            where: { emailVerificationToken: token as string },
        });

        if (!user) {
            return res.status(400).json({ message: "Token verifikasi tidak valid atau sudah digunakan" });
        }

        // Update user sebagai terverifikasi
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerificationToken: null, // Hapus token setelah verifikasi
            },
        });

        res.status(200).json({ message: "Email berhasil diverifikasi!" });
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat verifikasi email" });
    }
};