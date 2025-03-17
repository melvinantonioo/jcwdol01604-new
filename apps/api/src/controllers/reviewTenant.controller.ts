import { Request, Response } from "express";
import prisma from "@/prisma";
import { User } from "@/custom";

export const getTenantReviews = async (req: Request, res: Response) => {
    try {
        const tenantId = req.user?.id; 

        if (!tenantId) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        console.log("📢 Tenant ID:", tenantId); 

        const properties = await prisma.property.findMany({
            where: { tenantId },
            select: { id: true, name: true },
        });

        if (!properties.length) {
            return res.status(404).json({ message: "Anda belum memiliki properti" });
        }

        const propertyIds = properties.map((prop) => prop.id);

        console.log("🏠 Property IDs:", propertyIds);

        if (propertyIds.length === 0) {
            return res.status(404).json({ message: "Belum ada properti yang dimiliki" });
        }

        const validPropertyIds = propertyIds.filter((id) => !isNaN(Number(id)));
        if (validPropertyIds.length === 0) {
            return res.status(400).json({ message: "Property ID harus berupa angka" });
        }

        console.log("✅ Valid Property IDs:", validPropertyIds);

        const reviews = await prisma.review.findMany({
            where: {
                propertyId: { in: validPropertyIds }, 
            },
            include: {
                user: { select: { id: true, name: true, profilePicture: true } },
                property: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json(reviews);
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
