import { Request } from "express";
import multer from "multer";

export const SingleUploaderTest = () => {
    const maxSize = 1 * 1024 * 1024; // 1MB limit

    const storage = multer.memoryStorage(); // ✅ Simpan di memori, bukan di disk

    return multer({
        storage: storage,
        limits: { fileSize: maxSize },
    }).single("file");
};