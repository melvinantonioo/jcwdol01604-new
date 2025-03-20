import { getMyBookings, getProfile, updateEmail, updateProfile } from "../controllers/profile.controller";
import { getProfileEmail, resendEmailVerification } from "../controllers/verify.email";
import { VerifyToken } from "../middlewares/log.niddleware";

import { upload, uploadProfilePicture } from "../utils/upload.cloudinary";
import { SingleUploaderTest } from "../utils/uploaderTest";
import express from "express";

const router = express.Router();

router.get('/me', VerifyToken, getProfile);
router.get('/bookings', VerifyToken, getMyBookings);
router.put('/update', VerifyToken, SingleUploaderTest(), updateProfile);
router.post('/update-email', VerifyToken, updateEmail);
router.post("/resend-verification", VerifyToken, resendEmailVerification);
router.get('/getEmail', VerifyToken, getProfileEmail)

router.post('/upload', VerifyToken, upload.single("file"), uploadProfilePicture);

export default router;