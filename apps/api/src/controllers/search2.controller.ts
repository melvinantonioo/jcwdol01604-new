import { Request, Response } from "express";
import prisma from "@/prisma";

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

        const peakSeasonFilter = startDate && endDate ? {
            OR: [
                { startDate: { lte: new Date(startDate as string) }, endDate: { gte: new Date(startDate as string) } },
                { startDate: { lte: new Date(endDate as string) }, endDate: { gte: new Date(endDate as string) } },
                { startDate: { gte: new Date(startDate as string) }, endDate: { lte: new Date(endDate as string) } },
            ],
        } : {};


        const availabilityFilter = startDate && endDate ? {
            bookings: {
                none: {
                    AND: [
                        { startDate: { lt: new Date(endDate as string) } },
                        { endDate: { gt: new Date(startDate as string) } },
                        { status: { not: "CANCELLED" } }, 
                    ],
                },
            },
        } : {};

        const priceFilter = minPriceNum !== undefined || maxPriceNum !== undefined ? {
            price: {
                ...(minPriceNum !== undefined ? { gte: minPriceNum } : {}),
                ...(maxPriceNum !== undefined ? { lte: maxPriceNum } : {}),
            },
        } : {};

        const properties = await prisma.property.findMany({
            where: whereClause,
            include: {
                category: true,
                rooms: {
                    include: { peakSeasonRates: { where: peakSeasonFilter } }
                },
            },
            skip: (pageNum - 1) * sizeNum,
            take: sizeNum,
        });

        type PropertyWithRooms = typeof properties[number] & {
            rooms: {
                price: number;
                peakSeasonRates: {
                    priceAdjustment?: number;
                    percentageAdjustment?: number;
                }[];
            }[];
        };

        let results = (properties as PropertyWithRooms[]).map((prop) => {
            if (!prop.rooms || prop.rooms.length === 0) {
                return { ...prop, lowestRoomPrice: prop.basePrice };
            }

            let lowestRoomPrice = Math.min(...prop.rooms.map(r => {
                let adjustedPrice = r.price;
                r.peakSeasonRates.forEach((peakSeason) => {
                    if (peakSeason.priceAdjustment) {
                        adjustedPrice += peakSeason.priceAdjustment;
                    } else if (peakSeason.percentageAdjustment) {
                        adjustedPrice += (adjustedPrice * peakSeason.percentageAdjustment) / 100;
                    }
                });
                return adjustedPrice;
            }));

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