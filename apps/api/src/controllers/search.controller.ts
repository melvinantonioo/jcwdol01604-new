import { Request, Response } from "express";
import prisma from "@/prisma";

export const searchProperties = async (req: Request, res: Response) => {
    try {
        // Ambil query params
        const {
            name,
            location,
            categoryId,
            startDate,
            endDate,
            sort,
            page = "1",
            pageSize = "10",
        } = req.query;


        if (!location) {
            return res.status(400).json({
                message: "Location is required for this search."
            });
        }

        // Konversi tipe data numeric
        const pageNum = parseInt(page as string, 10) || 1;
        const sizeNum = parseInt(pageSize as string, 10) || 10;
        const catIdNum = categoryId ? parseInt(categoryId as string, 10) : undefined;

        // Sorting
        let orderBy: any = {};
        switch (sort) {
            case "name_asc":
                orderBy = { name: "asc" };
                break;
            case "name_desc":
                orderBy = { name: "desc" };
                break;
            case "price_asc":
                orderBy = { basePrice: "asc" };
                break;
            case "price_desc":
                orderBy = { basePrice: "desc" };
                break;
            default:
                orderBy = { createdAt: "desc" };
        }

        // whereClause property yang belum dihapus
        const whereClause: any = {
            isDeleted: false,
            // Filter lokasi 
            location: {
                contains: location as string,
                mode: "insensitive",
            },
        };

        // Filter nama (opsional)
        if (name) {
            whereClause.name = {
                contains: name as string,
                mode: "insensitive",
            };
        }

        // Filter kategori (opsional)
        if (catIdNum) {
            whereClause.categoryId = catIdNum;
        }

        // Konversi startDate, endDate
        let start: Date | undefined;
        let end: Date | undefined;
        if (startDate && endDate) {
            start = new Date(startDate as string);
            end = new Date(endDate as string);
        }

        // Filter date availability jika BOTH start & end ada
        if (start && end) {
            whereClause.rooms = {
                some: {
                    // Booking
                    bookings: {
                        none: {
                            AND: [
                                { startDate: { lt: end } }, // startDate < end
                                { endDate: { gt: start } }, // endDate > start
                                { status: { not: "CANCELLED" } },
                            ],
                        },
                    },
                    // Availability: tiap hari di rentang [start..end] isAvailable = true
                    availability: {
                        every: {
                            date: { gte: start, lte: end },
                            isAvailable: true,
                        },
                    },
                },
            };
        }

        // Query ke DB
        const [count, items] = await Promise.all([
            prisma.property.count({ where: whereClause }),
            prisma.property.findMany({
                where: whereClause,
                include: {
                    category: true,
                    rooms: true,
                },
                skip: (pageNum - 1) * sizeNum,
                take: sizeNum,
                orderBy,
            }),
        ]);

        // Hitung "lowestRoomPrice"
        const results = items.map((prop) => {
            let lowestRoomPrice: number | null = null;
            if (prop.rooms?.length > 0) {
                const minPrice = prop.rooms.reduce((acc, room) => {
                    return Math.min(acc, room.price);
                }, Infinity);
                if (minPrice !== Infinity) {
                    lowestRoomPrice = minPrice;
                }
            }
            return {
                ...prop,
                lowestRoomPrice,
            };
        });

        // Balikkan response
        return res.json({
            currentPage: pageNum,
            pageSize: sizeNum,
            totalItems: count,
            totalPages: Math.ceil(count / sizeNum),
            data: results,
        });
    } catch (error: any) {
        console.error("Error searching properties:", error);
        return res.status(500).json({
            message: "Terjadi kesalahan pada pencarian properti.",
        });
    }
};
