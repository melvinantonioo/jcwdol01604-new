import express from "express";
import { uploadImage } from "../controllers/imageUpload.controller";
import { AdminGuard, VerifyToken } from "@/middlewares/log.niddleware";

const router = express.Router();

router.post("/upload", VerifyToken, AdminGuard, uploadImage); 

export default router;