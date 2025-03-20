import { getBookingsWithProof, updateBookingStatus } from "../controllers/order.controller";
import { AdminGuard, VerifyToken } from "../middlewares/log.niddleware";
import express from "express";

const router = express.Router();

router.get("/", VerifyToken, AdminGuard, getBookingsWithProof);
router.patch("/:bookingId", VerifyToken, AdminGuard, updateBookingStatus);

export default router;