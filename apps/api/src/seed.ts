import { PrismaClient, BookingStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Hash password dummy
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Insert Users
    const user1 = await prisma.user.create({
        data: {
            name: "John Doe",
            email: "johndoe@example.com",
            password: hashedPassword,
            role: "USER",
            emailVerified: true,
        },
    });

    const tenant1 = await prisma.user.create({
        data: {
            name: "Tenant One",
            email: "tenantone@example.com",
            password: hashedPassword,
            role: "TENANT",
            emailVerified: true,
        },
    });

    // Insert Property Categories
    const category1 = await prisma.propertyCategory.create({ data: { name: "Apartment" } });
    const category2 = await prisma.propertyCategory.create({ data: { name: "Villa" } });
    const category3 = await prisma.propertyCategory.create({ data: { name: "Hostel" } });

    // Insert 10 Properties
    const properties = await prisma.property.createMany({
        data: [
            { name: "Luxury Apartment", tenantId: tenant1.id, categoryId: category1.id, description: "A high-end apartment in the city center.", location: "New York", basePrice: 150.0 },
            { name: "Cozy Villa", tenantId: tenant1.id, categoryId: category2.id, description: "A beautiful villa near the beach.", location: "Bali", basePrice: 300.0 },
            { name: "Downtown Studio", tenantId: tenant1.id, categoryId: category1.id, description: "Small but cozy studio.", location: "Los Angeles", basePrice: 120.0 },
            { name: "Seaside Bungalow", tenantId: tenant1.id, categoryId: category2.id, description: "A bungalow with ocean views.", location: "Malibu", basePrice: 400.0 },
            { name: "Mountain Cabin", tenantId: tenant1.id, categoryId: category2.id, description: "Escape to nature.", location: "Aspen", basePrice: 250.0 },
            { name: "City Hostel", tenantId: tenant1.id, categoryId: category3.id, description: "Affordable hostel in downtown.", location: "London", basePrice: 50.0 },
            { name: "Beachfront Apartment", tenantId: tenant1.id, categoryId: category1.id, description: "Wake up to ocean views.", location: "Miami", basePrice: 180.0 },
            { name: "Rustic Farmhouse", tenantId: tenant1.id, categoryId: category2.id, description: "Perfect for a weekend getaway.", location: "Texas", basePrice: 200.0 },
            { name: "High-Rise Condo", tenantId: tenant1.id, categoryId: category1.id, description: "Luxury condo with skyline views.", location: "Chicago", basePrice: 220.0 },
            { name: "Jungle Retreat", tenantId: tenant1.id, categoryId: category2.id, description: "Surrounded by rainforest.", location: "Costa Rica", basePrice: 280.0 },
        ],
    });

    // Ambil Property yang sudah dibuat
    const propertyList = await prisma.property.findMany();

    // Insert 20 Rooms (2 Room per Property)
    for (const property of propertyList) {
        await prisma.room.createMany({
            data: [
                { propertyId: property.id, name: `${property.name} - Standard Room`, price: property.basePrice, maxGuests: 2 },
                { propertyId: property.id, name: `${property.name} - Deluxe Room`, price: property.basePrice * 1.5, maxGuests: 4 },
            ],
        });
    }

    // Ambil Room yang sudah dibuat
    const roomList = await prisma.room.findMany();

    // Insert 5 Booking
    for (let i = 0; i < 5; i++) {
        await prisma.booking.create({
            data: {
                userId: user1.id,
                roomId: roomList[i].id,
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 hari ke depan
                status: BookingStatus.PAYMENT_CONFIRMED,
                totalPrice: roomList[i].price * 3,
            },
        });
    }

    // Insert 5 Review
    for (let i = 0; i < 5; i++) {
        await prisma.review.create({
            data: {
                userId: user1.id,
                propertyId: propertyList[i].id,
                rating: Math.floor(Math.random() * 5) + 1,
                comment: "Great place! Really enjoyed my stay.",
            },
        });
    }

    console.log("✅ Seeding completed!");
}

main()
    .catch((error) => {
        console.error("Error seeding database:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
