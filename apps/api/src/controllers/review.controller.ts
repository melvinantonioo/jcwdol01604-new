import { Request, Response } from "express";
import prisma from "@/prisma";
import { User } from "@/custom";

export const getReviewsByProperty = async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params; 

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

export const createReview = async (req: Request, res: Response) => {
    try {
        const { bookingId, rating, comment } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user.id; 

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { room: { include: { property: true } } },
        });

        if (!booking || booking.userId !== userId) {
            return res.status(403).json({ message: "Booking tidak valid" });
        }

        const existingReview = await prisma.review.findFirst({
            where: { userId, propertyId: booking.room.property.id },
        });

        if (existingReview) {
            return res.status(400).json({ message: "Anda sudah memberikan review untuk booking ini" });
        }

        const newReview = await prisma.review.create({
            data: {
                userId,
                propertyId: booking.room.property.id,
                rating,
                comment,
            },
        });

        res.status(201).json({ message: "Review berhasil dikirim", review: newReview });
    } catch (error) {
        console.error("❌ Error posting review:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengirim review" });
    }
};

export const checkUserReview = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const room = await prisma.room.findUnique({
            where: { id: Number(roomId) },
            select: { propertyId: true },
        });

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const existingReview = await prisma.review.findFirst({
            where: { userId, propertyId: room.propertyId },
        });

        return res.json({ hasReviewed: !!existingReview });
    } catch (error) {
        console.error("❌ Error checking review status:", error);
        return res.status(500).json({ message: "Gagal memeriksa status review" });
    }
};

export const getUserReviews = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 

        if (!userId) {
            return res.status(403).json({ message: "Akses ditolak" });
        }


        const reviews = await prisma.review.findMany({
            where: { userId },
            include: {
                property: {
                    select: { id: true, name: true, imageUrl: true }, 
                },
            },
            orderBy: { createdAt: "desc" }, 
        });

        console.log(" Reviews ditemukan:", reviews);

        return res.status(200).json(reviews);
    } catch (error) {
        console.error("❌ Error fetching user reviews:", error);
        return res.status(500).json({ message: "Gagal mengambil review Anda" });
    }
};