import { Request, Response } from "express";
// import prisma from "@/prisma";
import { Prisma } from "@prisma/client";
import { getProperties } from "../services/property.service";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const searchProperties = async (req: Request, res: Response) => {
    try {
        const { location, region, startDate, endDate, numGuests, sortBy } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date dan end date wajib diisi" });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        const guests = numGuests ? parseInt(numGuests as string) : 1;

        let properties = await prisma.property.findMany({
            where: {
                AND: [
                    location ? { location: { contains: location as string } } : {},
                    region ? { region: { contains: region as string } } : {},
                ],
            },
            include: {
                rooms: {
                    include: {
                        availability: {
                            where: {
                                date: { gte: start, lte: end },
                                isAvailable: true,
                            },
                        },
                    },
                },
            },
        });

        properties = properties.filter((property) =>
            property.rooms.some((room: Prisma.RoomGetPayload<{ include: { availability: true } }>) => room.maxGuests >= guests)
        );

        properties = properties.map((property) => ({
            ...property,
            isAvailable: property.rooms.some((room: Prisma.RoomGetPayload<{ include: { availability: true } }>) => room.availability.length > 0),
        }));

        if (sortBy === "price_asc") {
            properties.sort((a, b) => a.basePrice - b.basePrice);
        } else if (sortBy === "price_desc") {
            properties.sort((a, b) => b.basePrice - a.basePrice);
        }

        res.json({ properties });
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mencari properti" });
    }
};




export async function getPropertiesFilter(req: Request, res: Response) {
    try {
        const {
            page = '1',
            pageSize = '10',
            name = '',
            categoryId = '',
            sort = '',
            minPrice = '',
            maxPrice = '',
        } = req.query;

        const pageNum = parseInt(page as string, 10) || 1;
        const pageSizeNum = parseInt(pageSize as string, 10) || 10;

        const { totalItems, properties } = await getProperties({
            page: pageNum,
            pageSize: pageSizeNum,
            name: name as string,
            categoryId: categoryId as string,
            sort: sort as string,
            minPrice: minPrice as string,
            maxPrice: maxPrice as string,
        });

        return res.json({
            currentPage: pageNum,
            pageSize: pageSizeNum,
            totalItems,
            totalPages: Math.ceil(totalItems / pageSizeNum),
            data: properties,
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
