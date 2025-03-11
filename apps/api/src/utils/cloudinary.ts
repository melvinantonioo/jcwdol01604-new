import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import * as streamifier from "streamifier";

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
});

export const cloudinaryUpload = (
    file: Express.Multer.File
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        if (!file || !file.buffer) {
            return reject(new Error("File buffer tidak ditemukan."));
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" }, // ✅ Tambahkan resource_type agar bisa upload semua jenis file
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(error);
                }
                resolve(result!);
            }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
};
