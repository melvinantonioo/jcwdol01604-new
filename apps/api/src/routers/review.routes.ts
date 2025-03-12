import express from "express";
import { getReviewsByProperty } from "@/controllers/review.controller";
import { AdminGuard, VerifyToken } from "@/middlewares/log.niddleware";
import { getTenantReviews } from "@/controllers/reviewTenant.controller";

const router = express.Router();

router.get("/:propertyId", getReviewsByProperty);

router.get("/tenant", VerifyToken, AdminGuard, getTenantReviews); 
router.get("/reviewProp/:propertyId", VerifyToken, AdminGuard, getReviewsByProperty); 

export default router;
