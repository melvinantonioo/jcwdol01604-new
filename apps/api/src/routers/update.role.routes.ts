import express from "express";
import { updateRoleToOrganizer } from "../controllers/update.role";
import { VerifyToken } from "@/middlewares/log.niddleware";
import { checkEmailVerified } from "@/middlewares/email.middleware";

const router = express.Router();

router.post("/update-role", VerifyToken, checkEmailVerified, updateRoleToOrganizer);

export default router;