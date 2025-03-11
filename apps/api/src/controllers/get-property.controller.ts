// src/controllers/propertyController.ts
import { Request, Response } from 'express';
import prisma from '@/prisma';

export const getAllProperties = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const { startDate, endDate } = req.query;

        const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
        const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

        const totalProperties = await prisma.property.count({
            where: { isDeleted: false }, 
        });

        const properties = await prisma.property.findMany({
            where: { isDeleted: false }, 
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                category: true,
                rooms: {
                    where: { isAvailable: true }, 
                    include: {
                        availability: true, 
                        peakSeasonRates: {
                            where: {
                                ...(parsedStartDate && { startDate: { lte: parsedEndDate! } }),
                                ...(parsedEndDate && { endDate: { gte: parsedStartDate! } }),
                            },
                        },
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            skip,
            take: limit,
        });

        // **Hitung harga berdasarkan Peak Season**
        const updatedProperties = properties.map((property) => {
            let lowestRoomPrice = property.rooms.length > 0 ? Math.min(...property.rooms.map((room) => room.price)) : 0;

            property.rooms.forEach((room) => {
                room.peakSeasonRates.forEach((peakRate) => {
                    if (peakRate.priceAdjustment) {
                        lowestRoomPrice += peakRate.priceAdjustment;
                    }
                    if (peakRate.percentageAdjustment) {
                        lowestRoomPrice += (lowestRoomPrice * peakRate.percentageAdjustment) / 100;
                    }
                });
            });

            return {
                ...property,
                lowestRoomPrice,
            };
        });

        return res.status(200).json({
            properties: updatedProperties,
            totalPages: Math.ceil(totalProperties / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("Error fetching properties:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getPropertiesByCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { category, startDate, endDate } = req.query;

        if (!category) {
            return res.status(400).json({ message: "Parameter category diperlukan" });
        }

        const categoryData = await prisma.propertyCategory.findFirst({
            where: { name: String(category) },
        });

        if (!categoryData) {
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        }

        const properties = await prisma.property.findMany({
            where: {
                isDeleted: false, 
                categoryId: categoryData.id,
            },
            include: {
                tenant: {
                    select: { id: true, name: true, email: true },
                },
                category: true,
                rooms: {
                    where: { isAvailable: true }, 
                    include: {
                        availability: true, 
                        peakSeasonRates: true, 
                    },
                },
                reviews: {
                    include: {
                        user: { select: { id: true, name: true } },
                    },
                },
            },
        });

        const start = startDate ? new Date(startDate as string) : null;
        const end = endDate ? new Date(endDate as string) : null;

        const processedProperties = properties.map((prop) => {
            const roomPrices = prop.rooms.map((room) => {
                let roomPrice = room.price;

                if (start && end) {
                    room.peakSeasonRates.forEach((rate) => {
                        if (start >= rate.startDate && end <= rate.endDate) {
                            if (rate.priceAdjustment) {
                                roomPrice += rate.priceAdjustment;
                            } else if (rate.percentageAdjustment) {
                                roomPrice += (room.price * rate.percentageAdjustment) / 100;
                            }
                        }
                    });
                }

                return roomPrice;
            });

            const lowestRoomPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : prop.basePrice;

            return {
                ...prop,
                lowestRoomPrice,
            };
        });

        return res.status(200).json({ properties: processedProperties || [] }); 
    } catch (error) {
        console.error("❌ Error fetching properties by category:", error);
        return res.status(500).json({ message: "Internal server error", properties: [] });
    }
};

export const getDeletedProperties = async (req: Request, res: Response): Promise<Response> => {
    try {
        const deletedProperties = await prisma.property.findMany({
            where: { isDeleted: true }, 
            include: {
                tenant: { select: { id: true, name: true, email: true } },
                category: true,
                rooms: { where: { isAvailable: false } }, 
            },
        });

        return res.status(200).json(deletedProperties);
    } catch (error) {
        console.error("Error fetching deleted properties:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
