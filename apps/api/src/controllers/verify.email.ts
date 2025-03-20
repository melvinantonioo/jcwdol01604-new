import { Request, Response } from 'express';
// import prisma from '@/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import Handlebars from 'handlebars';
import fs from 'fs';
import { transporter } from '../lib/mail';
import crypto from 'crypto'
import { User } from '@/custom';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: "Token tidak valid" });
    }

    try {
        const user = await prisma.user.findFirst({
            where: { emailVerificationToken: token as string },
        });

        if (!user) {
            return res.status(400).json({ message: "Token verifikasi tidak valid atau sudah digunakan" });
        }


        if (user.emailVerified) {
            return res.status(400).json({ message: "Email sudah diverifikasi sebelumnya" });
        }


        if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
            return res.status(400).json({ message: "Token verifikasi telah kedaluwarsa" });
        }


        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerificationToken: null,  
                emailVerificationExpires: null, 
            },
        });

        res.status(200).json({ message: "Email berhasil diverifikasi!" });
    } catch (error) {
        console.error("❌ Verification error:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat verifikasi email" });
    }
};

export const resendEmailVerification = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        if (user.emailVerified) {
            return res.status(400).json({ message: "Email sudah diverifikasi" });
        }

        const emailVerificationToken = crypto.randomBytes(32).toString("hex");
        const emailVerificationExpires = new Date(Date.now() + 2 * 60 * 60 * 1000); 

        await prisma.user.update({
            where: { id: userId },
            data: {
                emailVerificationToken,
                emailVerificationExpires,
            },
        });

        const verificationLink = `${process.env.BASE_WEB_URL}/verify-email?token=${emailVerificationToken}`;

        await transporter.sendMail({
            to: user.email,
            subject: "Verifikasi Ulang Email",
            html: `<p>Silakan verifikasi ulang email Anda dengan mengklik link berikut:</p>
                <a href="${verificationLink}">Verifikasi Email</a>`,
        });

        res.status(200).json({ message: "Email verifikasi telah dikirim ulang, silakan cek email Anda" });
    } catch (error) {
        console.error("❌ Error resending verification email:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengirim ulang verifikasi email" });
    }
};

export const getProfileEmail = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true, 
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        res.status(500).json({ message: "Gagal mengambil profil pengguna" });
    }
};