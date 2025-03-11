import { Request, Response } from "express";
import prisma from "@/prisma";
import { User } from "@/custom";

export const getRoomsByProperty = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized, user not found" });
        }

        const { propertyId } = req.params;
        const { id: tenantId } = req.user as User; 

        const property = await prisma.property.findFirst({
            where: { id: Number(propertyId), tenantId },
        });

        if (!property) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        const rooms = await prisma.room.findMany({
            where: {
                propertyId: Number(propertyId),
                isAvailable: true, 
            },
        });

        return res.json({ rooms });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat mengambil data kamar" });
    }
};

export const addRoom = async (req: Request, res: Response) => {
    try {
        console.log("Request received:", req.body);
        console.log("Property ID:", req.params.propertyId);
        console.log("User Info:", req.user);

        const { propertyId } = req.params;
        const { name, description, price, maxGuests } = req.body;
        const { id: tenantId } = req.user as User;

        const property = await prisma.property.findFirst({
            where: { id: Number(propertyId), tenantId },
        });

        if (!property) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        const newRoom = await prisma.room.create({
            data: {
                propertyId: Number(propertyId),
                name,
                description,
                
                price: Number(price),
                maxGuests: Number(maxGuests),
            },
        });

        return res.status(201).json({ message: "Room berhasil ditambahkan", room: newRoom });
    } catch (error) {
        console.error("Error adding room:", error);
        return res.status(500).json({ message: "Gagal menambahkan room" });
    }
};

export const updateRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const { name, description, price, maxGuests } = req.body;
        const { id: tenantId } = req.user as User;

        const room = await prisma.room.findFirst({
            where: { id: Number(roomId), property: { tenantId } },
        });

        if (!room) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        const updatedRoom = await prisma.room.update({
            where: { id: Number(roomId) },
            data: { name, description, price: Number(price), maxGuests: Number(maxGuests) },
        });

        return res.json({ message: "Room berhasil diperbarui", room: updatedRoom });
    } catch (error) {
        console.error("Error updating room:", error);
        return res.status(500).json({ message: "Gagal memperbarui room" });
    }
};

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const { id: tenantId } = req.user as User;

        const room = await prisma.room.findFirst({
            where: { id: Number(roomId), property: { tenantId } },
        });

        if (!room) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        await prisma.room.update({
            where: { id: Number(roomId) },
            data: { isAvailable: false }, 
        });

        return res.json({ message: "Room berhasil dihapus (soft delete)" });
    } catch (error) {
        console.error("Error deleting room:", error);
        return res.status(500).json({ message: "Gagal menghapus room" });
    }
};
