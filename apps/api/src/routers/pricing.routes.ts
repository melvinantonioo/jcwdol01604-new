import { checkPropertyPricing } from "../controllers/pricing.controller";
import express from "express";

const router = express.Router();

router.get("/:propertyId/pricing", checkPropertyPricing);

export default router;