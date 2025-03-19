import { Request, Response } from "express";
import prisma from "@/prisma";
import bcrypt from 'bcrypt';
import path from 'path';
import Handlebars from 'handlebars';
import fs from 'fs';
import { transporter } from '../lib/mail';
import crypto from 'crypto'

export const getProfile = async (req: Request, res: Response) => {
    try {
        const { id: userId } = req.user as { id: number };

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
                profilePicture: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ message: "Gagal mengambil data profil" });
    }
};

export const getMyBookings = async (req: Request, res: Response) => {
    try {
        const { id: userId } = req.user as { id: number };

        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: { room: { select: { name: true, property: { select: { name: true } } } } },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat mengambil daftar booking" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { name, email, password } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Nama dan email wajib diisi" });
        }

        const currentUser = await prisma.user.findUnique({ where: { id: userId } });

        if (!currentUser) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        let hashedPassword;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        let emailVerificationToken;
        let emailUpdateData = {}; 

        if (email !== currentUser.email) {
            emailVerificationToken = crypto.randomBytes(32).toString("hex");

            emailUpdateData = {
                pendingEmail: email, 
                emailVerificationToken,
                emailVerified: false, 
            };


            const templatePath = path.join(__dirname, "../templates/", "register.hbs");
            const templateSource = fs.readFileSync(templatePath, "utf-8");
            const compiledTemplate = Handlebars.compile(templateSource);

            const verificationLink = `${process.env.BASE_WEB_URL}/verify-email?token=${emailVerificationToken}`;

            const html = compiledTemplate({
                name,
                emailUser: email,
                verificationLink,
            });

            await transporter.sendMail({
                to: email,
                subject: "Verify Your Email",
                html,
            });
        }


        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                ...(password && { password: hashedPassword }),
                ...emailUpdateData, 
            },
        });

        return res.status(200).json({ message: "Profil berhasil diperbarui", user: updatedUser });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({ message: "Gagal memperbarui profil" });
    }
};

export const updateEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!email) {
            return res.status(400).json({ message: "Email baru wajib diisi" });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah digunakan" });
        }

        const emailVerificationToken = crypto.randomBytes(32).toString("hex");
        const emailVerificationExpires = new Date(Date.now() + 2 * 60 * 60 * 1000); 

        await prisma.user.update({
            where: { id: userId },
            data: {
                email,
                emailVerified: false, 
                emailVerificationToken,
                emailVerificationExpires,
            },
        });

        const verificationLink = `${process.env.BASE_WEB_URL}/verify-email?token=${emailVerificationToken}`;

        await transporter.sendMail({
            to: email,
            subject: "Verifikasi Email Baru",
            html: `<p>Silakan verifikasi email baru Anda dengan mengklik link berikut:</p>
                <a href="${verificationLink}">Verifikasi Email</a>`,
        });

        res.status(200).json({ message: "Email berhasil diperbarui, cek email Anda untuk verifikasi" });
    } catch (error) {
        console.error("❌ Error updating email:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengganti email" });
    }
};