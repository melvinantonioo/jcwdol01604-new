import { deleteProperty, getTenantDashboardProperties, updateProperty } from '../controllers/dashboard.controller';
import { softDeleteProperty } from '../controllers/softDelete.controller';
import { AdminGuard, VerifyToken } from '../middlewares/log.niddleware';
import express from 'express';

const router = express.Router();

router.get('/properties', VerifyToken, AdminGuard, getTenantDashboardProperties);
router.put('/:propertyId/update', VerifyToken, AdminGuard, updateProperty);
router.delete('/delete', VerifyToken, AdminGuard, deleteProperty);

router.delete('/:propertyId/soft-delete', VerifyToken, AdminGuard, softDeleteProperty);


export default router;