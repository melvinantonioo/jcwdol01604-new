import { Request, Response } from "express";
import { cloudinaryUpload } from "../utils/Cloudinary1";
import multer from "multer";


const upload = multer({ storage: multer.memoryStorage() }).single("file");

export const uploadImage = (req: Request, res: Response) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Gagal mengunggah gambar." });
        }

        console.log("Received file:", req.file); 
        console.log("Received body:", req.body); 

        try {
            if (!req.file) {
                return res.status(400).json({ error: "Tidak ada file yang diunggah." });
            }

            const result = await cloudinaryUpload(req.file);
            return res.status(200).json({ imageUrl: result.secure_url });
        } catch (error) {
            console.error("Error upload ke Cloudinary:", error);
            return res.status(500).json({ error: "Terjadi kesalahan server." });
        }
    });
};
