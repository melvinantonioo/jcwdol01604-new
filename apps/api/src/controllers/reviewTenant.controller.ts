import { Request, Response } from "express";
import prisma from "@/prisma";
import { User } from "@/custom";

export const getTenantReviews = async (req: Request, res: Response) => {
    try {
        const { id: tenantId } = req.user as User;

        if (!tenantId) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        // Ambil semua property milik tenant ini
        const properties = await prisma.property.findMany({
            where: { tenantId },
            select: { id: true, name: true },
        });

        if (!properties || properties.length === 0) {
            return res.status(404).json({ message: "Anda belum memiliki properti" });
        }

        const propertyIds = properties.map((prop) => prop.id);

        // Cek apakah ada property yang dimiliki tenant ini
        if (propertyIds.length === 0) {
            return res.status(404).json({ message: "Belum ada properti yang dimiliki" });
        }

        // Ambil review berdasarkan propertyId yang dimiliki tenant ini
        const reviews = await prisma.review.findMany({
            where: {
                propertyId: { in: propertyIds },
            },
            include: {
                user: { select: { id: true, name: true } },
                property: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({
            message: "Berhasil mengambil review",
            reviews,
        });
    } catch (error) {
        console.error("❌ Error fetching tenant reviews:", error);
        return res.status(500).json({ message: "Gagal mengambil review" });
    }
};

export const getReviewsByProperty = async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        if (!propertyId) {
            return res.status(400).json({ message: "Property ID diperlukan" });
        }

        const reviews = await prisma.review.findMany({
            where: { propertyId: Number(propertyId) },
            include: {
                user: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json(reviews);
    } catch (error) {
        console.error("❌ Error fetching property reviews:", error);
        return res.status(500).json({ message: "Gagal mengambil review" });
    }
};
