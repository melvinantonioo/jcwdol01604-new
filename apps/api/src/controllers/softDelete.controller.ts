import { Request, Response } from "express";
// import prisma from "@/prisma";
import { User } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const softDeleteProperty = async (req: Request, res: Response) => {
    try {
        const { id: tenantId } = req.user as User; 
        const { propertyId } = req.params;

        const property = await prisma.property.findUnique({
            where: { id: parseInt(propertyId) },
        });

        if (!property) {
            return res.status(404).json({ message: "Properti tidak ditemukan" });
        }

        if (property.tenantId !== tenantId) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        await prisma.property.update({
            where: { id: parseInt(propertyId) },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        });

        res.json({ message: "Properti berhasil dihapus (soft delete)" });
    } catch (error) {
        console.error("Error deleting property:", error);
        res.status(500).json({ message: "Gagal menghapus properti" });
    }
};
