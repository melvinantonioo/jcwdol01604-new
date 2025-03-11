import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
    console.log("🗑️ Clearing database...");

    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.room.deleteMany();
    await prisma.property.deleteMany();
    await prisma.propertyCategory.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Database cleared!");
}

clearDatabase()
    .catch((error) => {
        console.error("Error clearing database:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });