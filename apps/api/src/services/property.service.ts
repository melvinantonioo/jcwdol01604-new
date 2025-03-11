// src/services/property.service.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GetPropertiesParams {
    page: number;
    pageSize: number;
    name?: string;
    categoryId?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
}

export async function getProperties({
    page,
    pageSize,
    name,
    categoryId,
    sort,
    minPrice,
    maxPrice,
}: GetPropertiesParams) {
    const skip = (page - 1) * pageSize;

    // Build filter (where)
    const propertyWhere: any = {
        isDeleted: false,
    };

    // Filter by name
    if (name) {
        propertyWhere.name = {
            contains: name,
            mode: 'insensitive', // case-insensitive
        };
    }

    // Filter by category
    if (categoryId) {
        propertyWhere.categoryId = Number(categoryId);
    }

    // Filter by price range (optional)
    let roomSomeFilter: any = {};
    if (minPrice) {
        roomSomeFilter.price = { gte: Number(minPrice) };
    }
    if (maxPrice) {
        roomSomeFilter.price = {
            ...roomSomeFilter.price,
            lte: Number(maxPrice),
        };
    }
    if (minPrice || maxPrice) {
        propertyWhere.rooms = {
            some: roomSomeFilter,
        };
    }

    // Hitung total items (untuk pagination)
    const totalItems = await prisma.property.count({
        where: propertyWhere,
    });

    // Ambil data property + rooms (untuk hitung price terendah)
    const rawProperties = await prisma.property.findMany({
        where: propertyWhere,
        include: {
            rooms: { select: { price: true } },
        },
        skip,
        take: pageSize,
    });

    // Hitung lowestRoomPrice
    const propertiesWithMinPrice = rawProperties.map((prop) => {
        const minRoomPrice = prop.rooms.length
            ? Math.min(...prop.rooms.map((room) => room.price))
            : 0;

        return {
            ...prop,
            lowestRoomPrice: minRoomPrice,
        };
    });

    // Sorting di memory
    let sortedProperties = [...propertiesWithMinPrice];
    switch (sort) {
        case 'nameAsc':
            sortedProperties.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'nameDesc':
            sortedProperties.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'priceAsc':
            sortedProperties.sort((a, b) => a.lowestRoomPrice - b.lowestRoomPrice);
            break;
        case 'priceDesc':
            sortedProperties.sort((a, b) => b.lowestRoomPrice - a.lowestRoomPrice);
            break;
        default:
            // No specific sorting
            break;
    }

    return {
        totalItems,
        properties: sortedProperties,
    };
}
