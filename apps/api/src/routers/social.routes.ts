import express from "express";
import { registerGoogleUser } from "../controllers/socialLogin.controller";

const router = express.Router();

router.post("/google-login", registerGoogleUser);

export default router;