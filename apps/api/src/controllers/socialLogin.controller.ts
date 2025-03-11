import { Request, Response } from "express";
import prisma from "../prisma"; // Sesuaikan dengan struktur project kamu
import jwt from "jsonwebtoken";

export const registerGoogleUser = async (req: Request, res: Response) => {
    try {
        const { email, name, picture } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Jika user belum ada, buat user baru
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    profilePicture: picture,
                    provider: "google",
                    emailVerified: true,
                },
            });
        }

        // 🔥 Buat JWT Token dari backend Express.js
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, {
            expiresIn: "7d",
        });

        res.json({ token, user });
    } catch (error) {
        console.error("Error in Google Login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


