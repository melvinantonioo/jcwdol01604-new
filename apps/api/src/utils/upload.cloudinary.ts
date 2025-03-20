import { Request, Response } from "express";
import multer from "multer";
// import cloudinary from "@/lib/cloudinary"; // Cloudinary Config
import { v2 as cloudinaryV2 } from "cloudinary";
import { Readable } from "stream";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

cloudinaryV2.config({
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
});


export const upload = multer({ storage: multer.memoryStorage() });

export const uploadToCloudinary = (fileBuffer: Buffer, folder = "profile_pictures"): Promise<string> => {
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

// ✅ 3. Middleware Upload
// export const uploadProfilePicture = async (req: Request, res: Response) => {
//     try {
//         if (!req.file) return res.status(400).json({ message: "File tidak ditemukan" });

//         const imageUrl = await uploadToCloudinary(req.file.buffer);
//         return res.status(200).json({ message: "Upload berhasil!", imageUrl });
//     } catch (error) {
//         return res.status(500).json({ message: "error upload" });
//     }
// };
export const uploadProfilePicture = async (req: Request, res: Response) => {
    try {
        if (!req.file) return res.status(400).json({ message: "File tidak ditemukan" });

        // Upload ke Cloudinary
        const imageUrl = await uploadToCloudinary(req.file.buffer);

        // Update URL foto di database
        const user = await prisma.user.update({
            where: { id: req.user?.id },
            data: { profilePicture: imageUrl },
        });

        return res.status(200).json({ message: "Foto profil berhasil diperbarui", profilePicture: imageUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Gagal mengunggah gambar" });
    }
};