import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../config";
import { User } from "../custom";
import { verify } from "jsonwebtoken";

async function VerifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) throw new Error("Unauthorized");

        const user = verify(token, process.env.SECRET_KEY as string);

        if (!user) throw new Error("Unauthorized");

        req.user = user as User;

        next();
    } catch (err) {
        next(err);
    }
}

export interface JWTPayload {
    email: string;
    name: string;
    role: string;
    id: number;
    iat?: number;
    exp?: number;
}


// Update Request type definition
declare global {
    namespace Express {
        interface Request {
            user1?: JWTPayload;
            dbUser?: {
                id: number;
                email: string;
                name: string;
                role: string;
                points: number;
            };
        }
    }
}


async function AdminGuard(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.user?.role !== "TENANT") throw new Error("Not an TENANT");

        next();
    } catch (err) {
        next(err);
    }
}

export { VerifyToken, AdminGuard };
