// // src/services/property.service.ts
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// interface GetPropertiesParams {
//     name?: string;
//     categoryId?: string;
//     minPrice?: string;
//     maxPrice?: string;
//     sort?: string;
// }

// export async function getProperties(params: GetPropertiesParams) {
//     const { name, categoryId, minPrice, maxPrice, sort } = params;

//     // 1) Build filter (where)
//     const propertyWhere: any = {
//         isDeleted: false,
//     };

//     // Filter by name
//     if (name) {
//         propertyWhere.name = {
//             contains: name,
//             // mode: 'insensitive',
//         };
//     }

//     // Filter by category
//     if (categoryId) {
//         propertyWhere.categoryId = Number(categoryId);
//     }

//     // Filter minPrice / maxPrice => property has room(s) in that price range
//     const roomSomeFilter: any = {};
//     if (minPrice) {
//         roomSomeFilter.price = { gte: Number(minPrice) };
//     }
//     if (maxPrice) {
//         roomSomeFilter.price = {
//             ...roomSomeFilter.price,
//             lte: Number(maxPrice),
//         };
//     }

//     if (minPrice || maxPrice) {
//         propertyWhere.rooms = {
//             some: roomSomeFilter,
//         };
//     }

//     // 2) Query property (beserta rooms)
//     let properties = await prisma.property.findMany({
//         where: propertyWhere,
//         include: { rooms: true },
//     });

//     // 3) Hitung lowestRoomPrice di memory
//     properties = properties.map((prop) => {
//         const minRoomPrice = prop.rooms.length
//             ? Math.min(...prop.rooms.map((r) => r.price))
//             : 0;
//         return {
//             ...prop,
//             lowestRoomPrice: minRoomPrice,
//         };
//     });

//     // 4) Sorting di memory (sort param: 'priceAsc', 'priceDesc', dsb.)
//     if (sort === 'priceAsc') {
//         properties.sort((a, b) => a.lowestRoomPrice - b.lowestRoomPrice);
//     } else if (sort === 'priceDesc') {
//         properties.sort((a, b) => b.lowestRoomPrice - a.lowestRoomPrice);
//     }
//     // Bisa ditambahkan sorting lain: nameAsc, nameDesc, dsb.

//     return properties;
// }
