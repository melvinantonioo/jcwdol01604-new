import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '@/prisma';
import { transporter } from '../lib/mail';
import path from 'path';
import Handlebars from 'handlebars';
import fs from 'fs';
import bcrypt from 'bcrypt';

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "Email tidak ditemukan" });
        }


        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000);


        await prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: expiresAt,
            },
        });


        const resetLink = `${process.env.BASE_WEB_URL}/reset-password?token=${resetToken}`;


        const templatePath = path.join(__dirname, "../templates/", "forgot-password.hbs");
        const templateSource = fs.readFileSync(templatePath, "utf-8");
        const compiledTemplate = Handlebars.compile(templateSource);

        const html = compiledTemplate({ resetLink });

        // Kirim email
        await transporter.sendMail({
            to: email,
            subject: "Reset Password",
            html,
        });

        res.status(200).json({ message: "Email reset password telah dikirim" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan, coba lagi nanti" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    try {
        // Cek apakah token valid dan belum expired
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() }, // Token masih berlaku
            },
        });

        if (!user) {
            return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa" });
        }

        // Hash password baru
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password dan hapus token reset
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        res.status(200).json({ message: "Password berhasil diubah" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan, coba lagi nanti" });
    }
};