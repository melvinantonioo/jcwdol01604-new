import { Request, Response } from "express";
import prisma from "../prisma"; 
import jwt from "jsonwebtoken";

export const registerGoogleUser = async (req: Request, res: Response) => {
    try {
        console.log(" Incoming Google login request:", req.body);

        const { email, name, picture } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {

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

        console.log("🔑 Generating JWT...");


        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SECRET_KEY as string, {
            expiresIn: "7d",
        });

        // console.log("Google login successful:", user);

        res.json({ token, user });
    } catch (error) {
        console.error("Error in Google Login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



