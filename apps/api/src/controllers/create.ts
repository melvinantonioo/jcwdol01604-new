
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { cloudinaryUpload } from '@/utils/Cloudinary1';
import multer from "multer";
import { v2 as cloudinaryV2 } from "cloudinary";
import { Readable } from "stream";

const prisma = new PrismaClient();

cloudinaryV2.config({
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
});

export const upload = multer({ storage: multer.memoryStorage() });

export const uploadToCloudinary = (fileBuffer: Buffer, folder = "property_images"): Promise<string> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream({ folder }, (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("Upload ke Cloudinary gagal"));
            resolve(result.secure_url);
        });

        const readableStream = new Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null);
        readableStream.pipe(stream);
    });
};

export const createPropertyWithRooms = async (req: Request, res: Response) => {
    try {
        const { name, categoryId, description, location, region, basePrice, rooms } = req.body;
        const tenantId = req.user?.id;
        if (!tenantId) return res.status(401).json({ error: "Unauthorized" });

        let imageUrl: string | null = null;

        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        const newProperty = await prisma.property.create({
            data: {
                tenantId,
                name,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
                categoryId: Number(categoryId),
                description,
                location,
                region,
                basePrice: Number(basePrice),
                imageUrl,
            },
        });

        if (rooms) {
            const parsedRooms = JSON.parse(rooms); 

            const roomData = parsedRooms.map((room: any) => ({
                propertyId: newProperty.id, 
                name: room.name,
                price: Number(room.price),
                maxGuests: Number(room.maxGuests),
            }));

            await prisma.room.createMany({ data: roomData }); 
        }

        res.status(201).json({ message: "Properti & Rooms berhasil dibuat.", property: newProperty });
    } catch (error) {
        console.error("Error saving property & rooms:", error);
        res.status(500).json({ error: "Terjadi kesalahan server." });
    }
};

export const createPropertyWithRooms2 = async (req: Request, res: Response) => {
    try {
        const { name, categoryName, description, location, region, basePrice, rooms } = req.body;
        const tenantId = req.user?.id;
        if (!tenantId) return res.status(401).json({ error: "Unauthorized" });

        const category = await prisma.propertyCategory.findFirst({
            where: { name: categoryName }, 
        });

        if (!category) {
            return res.status(400).json({ error: "Kategori tidak ditemukan." });
        }

        let imageUrl: string | null = null;
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        const newProperty = await prisma.property.create({
            data: {
                tenantId,
                name,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
                categoryId: category.id, 
                description,
                location,
                region,
                basePrice: Number(basePrice),
                imageUrl,
            },
        });

        if (rooms) {
            const parsedRooms = JSON.parse(rooms); 

            const roomData = parsedRooms.map((room: any) => ({
                propertyId: newProperty.id,
                name: room.name,
                price: Number(room.price),
                maxGuests: Number(room.maxGuests),
            }));

            await prisma.room.createMany({ data: roomData });
        }

        res.status(201).json({ message: "Properti & Rooms berhasil dibuat.", property: newProperty });
    } catch (error) {
        console.error("Error saving property & rooms:", error);
        res.status(500).json({ error: "Terjadi kesalahan server." });
    }
};

