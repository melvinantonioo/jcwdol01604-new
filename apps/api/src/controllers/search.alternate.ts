import { Request, Response } from "express";
import prisma from "@/prisma";

// export const searchAlternate = async (req: Request, res: Response) => {
//     try {
//         const {
//             location,
//             categoryId,
//             startDate,
//             endDate,
//             sort,
//             minPrice,
//             maxPrice,
//             page = "1",
//             pageSize = "10",
//         } = req.query;

//         const pageNum = parseInt(page as string, 10) || 1;
//         const sizeNum = parseInt(pageSize as string, 10) || 10;
//         const catIdNum = categoryId ? parseInt(categoryId as string, 10) : undefined;
//         const minPriceNum = minPrice ? parseFloat(minPrice as string) : undefined;
//         const maxPriceNum = maxPrice ? parseFloat(maxPrice as string) : undefined;

//         const whereClause: any = { isDeleted: false };

//         if (location) {
//             whereClause.location = {
//                 contains: location as string,
//             };
//         }

//         if (catIdNum) {
//             whereClause.categoryId = catIdNum;
//         }

//         if (minPriceNum !== undefined || maxPriceNum !== undefined) {
//             whereClause.rooms = {
//                 some: {
//                     price: {
//                         gte: minPriceNum || 0,
//                         lte: maxPriceNum || Infinity,
//                     },
//                 },
//             };
//         }

//         if (startDate && endDate) {
//             const start = new Date(startDate as string);
//             const end = new Date(endDate as string);
//             whereClause.rooms = {
//                 some: {
//                     bookings: {
//                         none: {
//                             AND: [
//                                 { startDate: { lt: end } },
//                                 { endDate: { gt: start } },
//                                 { status: { not: "CANCELLED" } },
//                             ],
//                         },
//                     },
//                     availability: {
//                         every: {
//                             date: { gte: start, lte: end },
//                             isAvailable: true,
//                         },
//                     },
//                 },
//             };
//         }

//         const [count, properties] = await Promise.all([
//             prisma.property.count({ where: whereClause }),
//             prisma.property.findMany({
//                 where: whereClause,
//                 include: {  
//                     category: true,
//                     rooms: {
//                         select: { price: true },
//                     },
//                 },
//                 skip: (pageNum - 1) * sizeNum,
//                 take: sizeNum,
//             }),
//         ]);

//         let results = properties.map((prop) => {
//             const lowestRoomPrice = prop.rooms.length > 0
//                 ? Math.min(...prop.rooms.map(r => r.price))
//                 : prop.basePrice;



//             return {
//                 ...prop,
//                 lowestRoomPrice,
//             };
//         });
//         // console.log("Data Sebelum Dikirim ke Frontend:", results);

//         if (sort === "price_asc") {
//             results.sort((a, b) => a.lowestRoomPrice - b.lowestRoomPrice);
//         } else if (sort === "price_desc") {
//             results.sort((a, b) => b.lowestRoomPrice - a.lowestRoomPrice);
//         };

//         if (sort === "priceAsc") {
//             console.log("Sorting by priceAsc (Sebelum):", results.map(p => ({
//                 name: p.name,
//                 lowestRoomPrice: p.lowestRoomPrice
//             })));

//             results.sort((a, b) => a.lowestRoomPrice - b.lowestRoomPrice);

//             console.log("Sorting by priceAsc (Sesudah):", results.map(p => ({
//                 name: p.name,
//                 lowestRoomPrice: p.lowestRoomPrice
//             })));
//         } else if (sort === "priceDesc") {
//             console.log("Sorting by priceDesc (Sebelum):", results.map(p => ({
//                 name: p.name,
//                 lowestRoomPrice: p.lowestRoomPrice
//             })));

//             results.sort((a, b) => b.lowestRoomPrice - a.lowestRoomPrice);

//             console.log("Sorting by priceDesc (Sesudah):", results.map(p => ({
//                 name: p.name,
//                 lowestRoomPrice: p.lowestRoomPrice
//             })));
//         }

//         return res.json({
//             currentPage: pageNum,
//             pageSize: sizeNum,
//             totalItems: count,
//             totalPages: Math.ceil(count / sizeNum),
//             data: results,
//         });
//     } catch (error: any) {
//         console.error("Error searching properties:", error);
//         return res.status(500).json({
//             message: "Terjadi kesalahan pada pencarian properti.",
//         });
//     }
// };


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
            whereClause.location = {
                contains: location as string,
            };
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
            where: whereClause,
            include: {
                category: true,
                rooms: {
                    include: {
                        peakSeasonRates: {
                            where: peakSeasonFilter, // ✅ Ambil Peak Season sesuai filter
                        },
                    },
                },
            },
            skip: (pageNum - 1) * sizeNum,
            take: sizeNum,
        });

        console.log("Properties ditemukan sebelum filtering:", properties);

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

            return {
                ...prop,
                lowestRoomPrice,
            };
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
            totalItems: properties.length,
            totalPages: Math.ceil(properties.length / sizeNum),
            data: results,
        });
    } catch (error: any) {
        console.error("Error searching properties:", error);
        return res.status(500).json({
            message: "Terjadi kesalahan pada pencarian properti.",
        });
    }
};
