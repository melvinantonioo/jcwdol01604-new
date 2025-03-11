import { Request, Response } from "express";
import prisma from "@/prisma";

export const createPeakSeasonRate = async (req: Request, res: Response) => {
    try {
        const { roomId, startDate, endDate, priceAdjustment, percentageAdjustment } = req.body;
        const { id: tenantId } = req.user as { id: number }; 

        const room = await prisma.room.findFirst({
            where: {
                id: roomId,
                property: { tenantId },
            },
        });

        if (!room) {
            return res.status(404).json({ message: "Room tidak ditemukan atau bukan milik Anda" });
        }

        // Buat Peak Season Rate
        const peakSeason = await prisma.peakSeasonRate.create({
            data: {
                roomId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                priceAdjustment: priceAdjustment ?? null,
                percentageAdjustment: percentageAdjustment ?? null,
            },
        });

        return res.status(201).json({ message: "Peak Season berhasil dibuat", peakSeason });
    } catch (error) {
        console.error("Error creating Peak Season:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat membuat Peak Season" });
    }
};

export const updatePeakSeasonRate = async (req: Request, res: Response) => {
    try {
        const { peakSeasonId } = req.params;
        const { startDate, endDate, priceAdjustment, percentageAdjustment } = req.body;
        const { id: tenantId } = req.user as { id: number };

        // Pastikan Peak Season adalah milik Tenant
        const peakSeason = await prisma.peakSeasonRate.findFirst({
            where: {
                id: Number(peakSeasonId),
                room: { property: { tenantId } },
            },
        });

        if (!peakSeason) {
            return res.status(404).json({ message: "Peak Season tidak ditemukan atau bukan milik Anda" });
        }

        // Update Peak Season Rate
        const updatedPeakSeason = await prisma.peakSeasonRate.update({
            where: { id: Number(peakSeasonId) },
            data: {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                priceAdjustment: priceAdjustment ?? null,
                percentageAdjustment: percentageAdjustment ?? null,
            },
        });

        return res.status(200).json({ message: "Peak Season berhasil diperbarui", updatedPeakSeason });
    } catch (error) {
        console.error("Error updating Peak Season:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat mengupdate Peak Season" });
    }
};

export const deletePeakSeasonRate = async (req: Request, res: Response) => {
    try {
        const { peakSeasonId } = req.params;
        const { id: tenantId } = req.user as { id: number };

        // Pastikan Peak Season adalah milik Tenant
        const peakSeason = await prisma.peakSeasonRate.findFirst({
            where: {
                id: Number(peakSeasonId),
                room: { property: { tenantId } },
            },
        });

        if (!peakSeason) {
            return res.status(404).json({ message: "Peak Season tidak ditemukan atau bukan milik Anda" });
        }

        // Hapus Peak Season
        await prisma.peakSeasonRate.delete({
            where: { id: Number(peakSeasonId) },
        });

        return res.status(200).json({ message: "Peak Season berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting Peak Season:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat menghapus Peak Season" });
    }
};


export const getTenantPeakSeasons = async (req: Request, res: Response) => {
    try {
        const { id: tenantId } = req.user as { id: number };

        // Ambil semua Peak Season berdasarkan Room milik Tenant
        const peakSeasons = await prisma.peakSeasonRate.findMany({
            where: {
                room: { property: { tenantId } },
            },
            include: {
                room: {
                    select: {
                        name: true,
                        property: { select: { name: true } },
                    },
                },
            },
        });

        return res.status(200).json({ peakSeasons });
    } catch (error) {
        console.error("Error fetching Peak Seasons:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat mengambil data Peak Season" });
    }
};


