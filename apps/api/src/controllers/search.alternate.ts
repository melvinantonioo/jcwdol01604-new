import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchAlternate = async (req: Request, res: Response) => {
    try {
        const {
            location,
            categoryId,
            startDate,
            endDate,
            sort,
            minPrice,
            maxPrice,
            page = "1",
            pageSize = "10",
        } = req.query;

        const pageNum = parseInt(page as string, 10) || 1;
        const sizeNum = parseInt(pageSize as string, 10) || 10;
        const catIdNum = categoryId ? parseInt(categoryId as string, 10) : undefined;
        const minPriceNum = minPrice ? parseFloat(minPrice as string) : undefined;
        const maxPriceNum = maxPrice ? parseFloat(maxPrice as string) : undefined;

        const whereClause: any = { isDeleted: false };

        if (location) {
            whereClause.location = { contains: location as string };
        }

        if (catIdNum) {
            whereClause.categoryId = catIdNum;
        }

        const peakSeasonFilter = startDate && endDate ? {
            OR: [
                { startDate: { lte: new Date(startDate as string) }, endDate: { gte: new Date(startDate as string) } },
                { startDate: { lte: new Date(endDate as string) }, endDate: { gte: new Date(endDate as string) } },
                { startDate: { gte: new Date(startDate as string) }, endDate: { lte: new Date(endDate as string) } },
            ],
        } : {};


        const properties = await prisma.property.findMany({
            where: {
                isDeleted: false,
                rooms: {
                    some: {
                        isAvailable: true,
                        price: {
                            gte: minPriceNum ?? 0,  
                            lte: maxPriceNum ?? Number.MAX_SAFE_INTEGER, 
                        },
                    },
                },
            },
            include: {
                category: true,
                rooms: {
                    include: {
                        peakSeasonRates: true,
                    },
                },
            },
            skip: (pageNum - 1) * sizeNum,
            take: sizeNum,

        });


        let orderByClause: any = undefined;
        if (sort === "price_asc") {
            orderByClause = { rooms: { _min: { price: "asc" } } };  
        } else if (sort === "price_desc") {
            orderByClause = { rooms: { _min: { price: "desc" } } }; 
        }


        let results = properties.map((prop) => {
            let lowestRoomPrice = prop.rooms.length > 0
                ? Math.min(...prop.rooms.map(r => {
                    let adjustedPrice = r.price;
                    r.peakSeasonRates.forEach(peakSeason => {
                        if (peakSeason.priceAdjustment) {
                            adjustedPrice += peakSeason.priceAdjustment;
                        } else if (peakSeason.percentageAdjustment) {
                            adjustedPrice += (adjustedPrice * peakSeason.percentageAdjustment) / 100;
                        }
                    });
                    return adjustedPrice;
                }))
                : prop.basePrice;

            return { ...prop, lowestRoomPrice };
        });

        console.log("Hasil pencarian dikirim ke frontend:", results);

        if (sort === "price_asc") {
            results.sort((a, b) => a.lowestRoomPrice - b.lowestRoomPrice);
        } else if (sort === "price_desc") {
            results.sort((a, b) => b.lowestRoomPrice - a.lowestRoomPrice);
        }

        return res.json({
            currentPage: pageNum,
            pageSize: sizeNum,
            totalItems: results.length,
            totalPages: Math.ceil(results.length / sizeNum),
            data: results,
        });
    } catch (error: any) {
        console.error("Error searching properties:", error);
        return res.status(500).json({ message: "Terjadi kesalahan pada pencarian properti." });
    }
};

export const searchAlternate2 = async (req: Request, res: Response) => {
    try {
        const {
            location,
            categoryId,
            startDate,
            endDate,
            sort,
            minPrice,
            maxPrice,
            page = "1",
            pageSize = "10",
        } = req.query;

        const pageNum = parseInt(page as string, 10) || 1;
        const sizeNum = parseInt(pageSize as string, 10) || 10;
        const catIdNum = categoryId ? parseInt(categoryId as string, 10) : undefined;
        const minPriceNum = minPrice ? parseFloat(minPrice as string) : undefined;
        const maxPriceNum = maxPrice ? parseFloat(maxPrice as string) : undefined;


        const whereClause: any = { isDeleted: false };

        if (location) {
            whereClause.location = { contains: location as string };
        }

        if (catIdNum) {
            whereClause.categoryId = catIdNum;
        }


        if (minPriceNum !== undefined || maxPriceNum !== undefined) {
            whereClause.rooms = {
                some: {
                    isAvailable: true,
                    price: {
                        ...(minPriceNum !== undefined ? { gte: minPriceNum } : {}),
                        ...(maxPriceNum !== undefined ? { lte: maxPriceNum } : {}),
                    },
                },
            };
        }

        if (startDate && endDate) {
            whereClause.rooms = {
                some: {
                    availability: {
                        some: {
                            date: { gte: new Date(startDate as string), lte: new Date(endDate as string) },
                        },
                    },
                },
            };
        }


        const properties = await prisma.property.findMany({
            where: whereClause,
            include: {
                category: true,
                rooms: {
                    include: {
                        peakSeasonRates: true,
                    },
                },
            },
            skip: (pageNum - 1) * sizeNum,
            take: sizeNum,
        });


        let results = properties.map((prop) => {
            let lowestRoomPrice = prop.rooms.length > 0
                ? Math.min(...prop.rooms.map(r => {
                    let adjustedPrice = r.price;
                    r.peakSeasonRates.forEach(peakSeason => {
                        if (peakSeason.priceAdjustment) {
                            adjustedPrice += peakSeason.priceAdjustment;
                        } else if (peakSeason.percentageAdjustment) {
                            adjustedPrice += (adjustedPrice * peakSeason.percentageAdjustment) / 100;
                        }
                    });
                    return adjustedPrice;
                }))
                : prop.basePrice;

            return { ...prop, lowestRoomPrice };
        });


        if (sort === "price_asc") {
            results.sort((a, b) => a.lowestRoomPrice - b.lowestRoomPrice);
        } else if (sort === "price_desc") {
            results.sort((a, b) => b.lowestRoomPrice - a.lowestRoomPrice);
        }

        return res.json({
            currentPage: pageNum,
            pageSize: sizeNum,
            totalItems: results.length,
            totalPages: Math.ceil(results.length / sizeNum),
            data: results,
        });
    } catch (error: any) {
        console.error("❌ Error searching properties:", error);
        return res.status(500).json({ message: "Terjadi kesalahan pada pencarian properti." });
    }
};
