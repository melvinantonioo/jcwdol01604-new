import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkEmailVerified = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.user as { id: number };

        const user = await prisma.user.findUnique({
            where: { id },
            select: { emailVerified: true }
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        if (!user.emailVerified) {
            return res.status(403).json({ message: "Verifikasi email diperlukan untuk melanjutkan." });
        }

        next(); 
    } catch (error) {
        console.error("Middleware error:", error);
        return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};
