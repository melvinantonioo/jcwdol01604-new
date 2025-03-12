import { Request, Response } from "express";
import prisma from "@/prisma";

export const getReviewsByProperty = async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params; // ✅ Ambil propertyId dari params

        if (!propertyId) {
            return res.status(400).json({ message: "Property ID diperlukan" });
        }

        const propertyIdNum = parseInt(propertyId, 10);
        if (isNaN(propertyIdNum)) {
            return res.status(400).json({ message: "Property ID harus berupa angka" });
        }

        const reviews = await prisma.review.findMany({
            where: { propertyId: propertyIdNum },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json(reviews);
    } catch (error) {
        console.error("❌ Error fetching reviews:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat mengambil review" });
    }
};
