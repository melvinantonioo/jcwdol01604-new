import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPropertyDetails = async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        if (!propertyId) {
            return res.status(400).json({ message: "Property ID diperlukan" });
        }

        const property = await prisma.property.findUnique({
            where: { id: parseInt(propertyId) },
            include: {
                category: true, 
                tenant: {
                    select: { id: true, name: true, email: true }, 
                },
                rooms: {
                    include: {
                        availability: true,
                        peakSeasonRates: true, 
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: { name: true, profilePicture: true }, 
                        },
                    },
                },
            },
        });

        if (!property) {
            return res.status(404).json({ message: "Properti tidak ditemukan" });
        }

        const averageRating =
            property.reviews.length > 0
                ? property.reviews.reduce((acc, review) => acc + review.rating, 0) / property.reviews.length
                : null;

        res.json({
            id: property.id,
            name: property.name,
            description: property.description,
            location: `${property.location}, ${property.region}`,
            basePrice: property.basePrice,
            category: property.category.name,
            tenant: property.tenant,
            rooms: property.rooms.map((room) => ({
                id: room.id,
                name: room.name,
                description: room.description,
                price: room.price,
                maxGuests: room.maxGuests,
                availability: room.availability.map((av) => ({
                    date: av.date,
                    isAvailable: av.isAvailable,
                })),
                peakSeasonRates: room.peakSeasonRates.map((rate) => ({
                    startDate: rate.startDate,
                    endDate: rate.endDate,
                    priceAdjustment: rate.priceAdjustment,
                    percentageAdjustment: rate.percentageAdjustment,
                })),
            })),
            reviews: property.reviews.map((review) => ({
                id: review.id,
                user: review.user.name,
                profilePicture: review.user.profilePicture,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
            })),
            averageRating,
        });
    } catch (error) {
        console.error("Error fetching property details:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil detail properti" });
    }
};

export const getPropertyDetailsBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({ message: "Slug diperlukan" });
        }

        console.log("🔎 Fetching Property by Slug:", slug);

        const property = await prisma.property.findUnique({
            where: { slug },
            include: {
                category: true,
                tenant: { select: { id: true, name: true, email: true } },
                rooms: { include: { availability: true, peakSeasonRates: true } },
                reviews: { include: { user: { select: { name: true, profilePicture: true } } } },
            },
        });

        if (!property) {
            console.warn("⚠️ Properti tidak ditemukan untuk slug:", slug);
            return res.status(404).json({ message: "Properti tidak ditemukan" });
        }

        if (!property.location || !property.region) {
            console.warn("⚠️ Lokasi atau Region NULL! Cek database:", property);
        }

        const locationString = property.location && property.region
            ? `${property.location}, ${property.region}`
            : null;

        console.log("📍 Lokasi Properti:", locationString);

        const averageRating = property.reviews.length > 0
            ? property.reviews.reduce((acc, r) => acc + r.rating, 0) / property.reviews.length
            : null;

        return res.json({
            id: property.id,
            name: property.name,
            slug: property.slug,
            description: property.description,
            location: property.location,
            region: property.region,     
            basePrice: property.basePrice,
            category: property.category?.name,
            tenant: property.tenant,
            imageUrl: property.imageUrl,
            rooms: property.rooms.map(room => ({
                id: room.id,
                name: room.name,
                maxGuests: room.maxGuests,
            })),
            reviews: property.reviews.map(review => ({
                id: review.id,
                user: review.user.name,
                comment: review.comment,
            })),
            averageRating,
        });

    } catch (error: any) {
        console.error("❌ Error fetching property details by slug:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil detail properti" });
    }
};
