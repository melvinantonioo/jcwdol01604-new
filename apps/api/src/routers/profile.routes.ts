import { getMyBookings, getProfile, updateProfile } from "@/controllers/profile.controller";
import { VerifyToken } from "@/middlewares/log.niddleware";

import { upload, uploadProfilePicture } from "@/utils/upload.cloudinary";
import { SingleUploaderTest } from "@/utils/uploaderTest";
import express from "express";

const router = express.Router();

router.get('/me', VerifyToken, getProfile);
router.get('/bookings', VerifyToken, getMyBookings);
router.put('/update', VerifyToken, SingleUploaderTest(), updateProfile);

router.post('/upload', VerifyToken, upload.single("file"), uploadProfilePicture);

export default router;