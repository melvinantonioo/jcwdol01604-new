import express from "express";
import { checkUserReview, createReview, getReviewsByProperty, getUserReviews } from "../controllers/review.controller";
import { AdminGuard, VerifyToken } from "../middlewares/log.niddleware";
import { getTenantReviews } from "../controllers/reviewTenant.controller";

const router = express.Router();

router.get("/:propertyId", getReviewsByProperty);

router.get("/tenant", VerifyToken, AdminGuard, getTenantReviews); 
router.get("/reviewProp/:propertyId", VerifyToken, AdminGuard, getReviewsByProperty); 

router.post("/user-review", VerifyToken, createReview);
router.get("/check/:propertyId", VerifyToken, checkUserReview);
router.get('/user', VerifyToken, getUserReviews);

export default router;
