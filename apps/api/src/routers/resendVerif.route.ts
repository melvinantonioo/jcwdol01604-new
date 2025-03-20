import express from "express";
import { VerifyToken } from "../middlewares/log.niddleware";
import { resendEmailVerification } from "../controllers/verify.email";

const router = express.Router();

router.post("/resend-verification", VerifyToken, resendEmailVerification);

export default router;