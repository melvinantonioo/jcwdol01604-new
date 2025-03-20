// import { deleteRoom, updateRoom } from '@/controllers/dashboard.controller';
import { addRoom, deleteRoom, getRoomsByProperty, updateRoom } from '../controllers/room.controller';
import { AdminGuard, VerifyToken } from '../middlewares/log.niddleware';
import { Router } from 'express';
import express from 'express';

const router = Router();

router.get('/:propertyId/rooms', VerifyToken, AdminGuard, getRoomsByProperty);
router.post("/:propertyId", VerifyToken, AdminGuard, addRoom);
router.put("/:roomId/update", VerifyToken, AdminGuard, updateRoom);
router.delete("/:roomId/delete", VerifyToken, AdminGuard, deleteRoom);

export default router;