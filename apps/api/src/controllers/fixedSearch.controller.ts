import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchQueryUpdate = async (req: Request, res: Response) => {
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
            whereClause.location = {
                contains: location as string,
                mode: "insensitive",
            };
        }

        if (catIdNum) {
            whereClause.categoryId = catIdNum;
        }

        if (minPriceNum !== undefined || maxPriceNum !== undefined) {
            whereClause.rooms = {
                some: {
                    price: {
                        gte: minPriceNum || 0,
                        lte: maxPriceNum || Infinity,
                    },
                },
            };
        }

        if (startDate && endDate) {
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);

            whereClause.rooms = {
                some: {
                    
                    bookings: {
                        none: {
                            AND: [
                                { startDate: { lt: end } },
                                { endDate: { gt: start } },
                                { status: { not: "CANCELLED" } },
                            ],
                        },
                    },
                    // **Cek availability kamar berdasarkan tanggal**
                    OR: [
                        // **Jika ada data di `RoomAvailability`, cek ketersediaan**
                        {
                            availability: {
                                some: {
                                    date: { gte: start, lte: end },
                                    isAvailable: true,
                                },
                            },
                        },
                        // **Jika `RoomAvailability` kosong, anggap semua kamar tersedia**
                        {
                            availability: {
                                none: {},
                            },
                        },
                    ],
                },
            };
        }

        // Query ke DB
        const [count, properties] = await Promise.all([
            prisma.property.count({ where: whereClause }),
            prisma.property.findMany({
                where: whereClause,
                include: {
                    category: true,
                    rooms: {
                        select: { price: true },
                    },
                },
                skip: (pageNum - 1) * sizeNum,
                take: sizeNum,
            }),
        ]);

        // Hitung "lowestRoomPrice"
        let results = properties.map((prop) => {
            const lowestRoomPrice = prop.rooms.length > 0
                ? Math.min(...prop.rooms.map(r => r.price))
                : prop.basePrice;

            return {
                ...prop,
                lowestRoomPrice,
            };
        });

        // Sorting harga di JavaScript
        if (sort === "price_asc") {
            results.sort((a, b) => a.lowestRoomPrice - b.lowestRoomPrice);
        } else if (sort === "price_desc") {
            results.sort((a, b) => b.lowestRoomPrice - a.lowestRoomPrice);
        }

        // **Tambahkan logging untuk pengecekan**
        console.log("Data setelah sorting:", results.map(p => ({
            name: p.name,
            lowestRoomPrice: p.lowestRoomPrice
        })));

        // Kirim response
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
