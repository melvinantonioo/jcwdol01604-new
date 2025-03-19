import { Request, Response } from "express";
import prisma from "../prisma";

async function updateRoleToOrganizer(req: Request, res: Response) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (user.role === "TENANT") {
            res.status(200).json({ message: "You are already an ORGANIZER" });
            return;
        }

        await prisma.user.update({
            where: { id: userId },
            data: { role: "TENANT" }
        });

        res.status(200).json({ message: "Your role has been updated to ORGANIZER. You can now access the Create Event page." });
    } catch (error) {
        console.error("updateRoleToOrganizer error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export { updateRoleToOrganizer };