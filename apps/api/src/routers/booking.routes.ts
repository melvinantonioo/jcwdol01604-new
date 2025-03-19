import express from "express";
import { createBooking, getBookingDetails } from "@/controllers/booking.controller";

import { AdminGuard, VerifyToken } from "@/middlewares/log.niddleware";
import { checkEmailVerified } from "@/middlewares/email.middleware";
import { getTenantBookings, getUserBookings, updateBookingStatus } from "@/controllers/bookManagement.controller";
import { checkRoomAvailability } from "@/controllers/roomChecker.controller";

const router = express.Router();

router.post('/', VerifyToken, checkEmailVerified, createBooking);
router.get(':bookingId', VerifyToken, checkEmailVerified, getBookingDetails);

router.get('/tenant-book', VerifyToken, AdminGuard, getTenantBookings );
router.get('/user-book', VerifyToken, checkEmailVerified, getUserBookings);
router.put('/update-book', VerifyToken, AdminGuard,updateBookingStatus );

router.put('/edit-user', VerifyToken, updateBookingStatus );


router.post('/check-availability', checkRoomAvailability);

export default router;
