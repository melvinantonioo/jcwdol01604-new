import { Request, Response } from "express";
import prisma from "@/prisma";
import { User } from "@/custom";

export const getTenantDashboardProperties = async (req: Request, res: Response) => {
    try {
        const { id: tenantId } = req.user as User;
        if (!tenantId) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        const page = parseInt(req.query.page as string) || 1; // Default page 1
        const limit = parseInt(req.query.limit as string) || 10; // Default 10 items per page
        const skip = (page - 1) * limit;

        // Ambil total properti untuk pagination
        const totalProperties = await prisma.property.count({
            where: { tenantId, isDeleted: false },
        });

        // Ambil properti dengan pagination
        const properties = await prisma.property.findMany({
            where: { tenantId, isDeleted: false },
            include: {
                category: true,
                rooms: true,
                reviews: {
                    select: { rating: true },
                },
            },
            skip,
            take: limit,
        });

        res.json({
            properties,
            totalPages: Math.ceil(totalProperties / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("Error fetching tenant properties:", error);
        res.status(500).json({ message: "Gagal mengambil daftar properti" });
    }
};


export const createProperty = async (req: Request, res: Response) => {
    try {
        const { id: tenantId } = req.user as User;
        const { name, categoryId, description, location, region, basePrice, imageUrl } = req.body;

        if (!tenantId) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        const newProperty = await prisma.property.create({
            data: {
                tenantId,
                name,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
                categoryId,
                description,
                location,
                region,
                basePrice,
                imageUrl,
            },
        });

        res.status(201).json({ message: "Properti berhasil ditambahkan", property: newProperty });
    } catch (error) {
        console.error("Error creating property:", error);
        res.status(500).json({ message: "Gagal menambahkan properti" });
    }
};

export const updateProperty = async (req: Request, res: Response) => {
    try {
        const { id: tenantId } = req.user as User;
        const { propertyId } = req.params;
        const { name, categoryId, description, location, region, basePrice, imageUrl } = req.body;

        const property = await prisma.property.findUnique({ where: { id: parseInt(propertyId) } });

        if (!property || property.tenantId !== tenantId) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        const updatedProperty = await prisma.property.update({
            where: { id: parseInt(propertyId) },
            data: { name, categoryId, description, location, region, basePrice, imageUrl },
        });

        res.json({ message: "Properti berhasil diperbarui", property: updatedProperty });
    } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ message: "Gagal mengupdate properti" });
    }
};

export const deleteProperty = async (req: Request, res: Response) => {
    try {
        const { id: tenantId } = req.user as User;
        const { propertyId } = req.params;

        const property = await prisma.property.findUnique({ where: { id: parseInt(propertyId) } });

        if (!property || property.tenantId !== tenantId) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        await prisma.property.update({
            where: { id: parseInt(propertyId) },
            data: { isDeleted: true, deletedAt: new Date() },
        });

        res.json({ message: "Properti berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting property:", error);
        res.status(500).json({ message: "Gagal menghapus properti" });
    }
};

export const addRoomToProperty = async (req: Request, res: Response) => {
    try {
        const { id: tenantId } = req.user as User;
        const { propertyId } = req.params;
        const { name, description, price, maxGuests } = req.body;

        const property = await prisma.property.findUnique({ where: { id: parseInt(propertyId) } });

        if (!property || property.tenantId !== tenantId) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        const newRoom = await prisma.room.create({
            data: {
                propertyId: parseInt(propertyId),
                name,
                description,
                price,
                maxGuests,
            },
        });

        res.status(201).json({ message: "Kamar berhasil ditambahkan", room: newRoom });
    } catch (error) {
        console.error("Error adding room:", error);
        res.status(500).json({ message: "Gagal menambahkan kamar" });
    }
};

//room 
export const updateRoom = async (req: Request, res: Response) => {
    try {
        const { id: tenantId } = req.user as User;
        const { roomId } = req.params;
        const { name, description, price, maxGuests } = req.body;

        const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) }, include: { property: true } });

        if (!room || room.property.tenantId !== tenantId) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        const updatedRoom = await prisma.room.update({
            where: { id: parseInt(roomId) },
            data: { name, description, price, maxGuests },
        });

        res.json({ message: "Kamar berhasil diperbarui", room: updatedRoom });
    } catch (error) {
        console.error("Error updating room:", error);
        res.status(500).json({ message: "Gagal mengupdate kamar" });
    }
};

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const { id: tenantId } = req.user as User;
        const { roomId } = req.params;

        const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) }, include: { property: true } });

        if (!room || room.property.tenantId !== tenantId) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        await prisma.room.delete({ where: { id: parseInt(roomId) } });

        res.json({ message: "Kamar berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({ message: "Gagal menghapus kamar" });
    }
};