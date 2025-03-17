import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/prisma';
import path from 'path';
import Handlebars from 'handlebars';
import fs from 'fs'; // File system
import { transporter } from '../lib/mail';
import crypto from 'crypto'
import { User } from '@/custom';

export const registerUser = async (req: Request, res: Response) => {
    const templatePath = path.join(__dirname, "../templates/", "register.hbs");
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = Handlebars.compile(templateSource);

    const { name, email, password, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const emailVerificationToken = crypto.randomBytes(32).toString("hex");
        const emailVerificationExpires = new Date(Date.now() + 2 * 60 * 60 * 1000); // Expired 2 jam

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                emailVerificationToken,
                emailVerificationExpires,
            },
        });

        const verificationLink = `${process.env.BASE_WEB_URL}/verify-email?token=${emailVerificationToken}`;

        const html = compiledTemplate({ name, emailUser: email, verificationLink });

        await transporter.sendMail({
            to: email,
            subject: "Verify Your Email",
            html,
        });

        console.log("Link verifikasi dikirim:", verificationLink);
        res.status(201).json({
            message: 'Registrasi berhasil, silakan cek email untuk verifikasi',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            }
        });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Registrasi gagal', error: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                role: true,
                profilePicture: true
            }
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        if (!user.password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }


        // Cek password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        // Generate JWT - hanya berisi data penting
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture
            },
            process.env.SECRET_KEY as string,
            { expiresIn: '1h' }
        );

        res.status(200)
            .cookie("access_token", token, {
                maxAge: 3600000 // 1 jam
            })
            .json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture
                }
            });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Login failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export async function UpdateProfilePicture(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.user as User;
        const { file } = req;

        if (!file) {
            throw new Error("No file uploaded");
        }

        await prisma.user.update({
            where: {
                email,
            },
            data: {
                profilePicture: file?.filename,
            },
        });

        res.status(200).send({
            message: "Success",
        });
    } catch (err) {
        next(err);
    }
}