import { Router } from 'express';
import { getAllProperties, getAllProperties2, getPropertiesByCategory } from '@/controllers/get-property.controller';
import { getPropertyDetails, getPropertyDetailsBySlug } from '@/controllers/get.propertyDetail.controller';
import { AdminGuard, VerifyToken } from '@/middlewares/log.niddleware';
import { upload } from "@/utils/upload.cloudinary";
import { SingleUploader } from '@/utils/uploader';
import { getPropertiesFilter } from '@/controllers/filter.controller';
import { createPropertyWithRooms, createPropertyWithRooms2 } from '@/controllers/create';

const router = Router();

router.get('/properties', getAllProperties);
router.get('/properties/category', getPropertiesByCategory);
router.get("/:propertyId", getPropertyDetails);
router.get("/slug/:slug", getPropertyDetailsBySlug);

router.post(
    '/create-listing',
    VerifyToken,
    AdminGuard,
    upload.single("file"),
    createPropertyWithRooms2
)

router.get('/filter', getPropertiesFilter)

export default router;