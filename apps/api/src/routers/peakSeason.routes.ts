import express from "express";
import {
    createPeakSeasonRate,
    updatePeakSeasonRate,
    deletePeakSeasonRate,
    getTenantPeakSeasons,
} from "../controllers/peakSeason.controller";

import { AdminGuard, VerifyToken } from "../middlewares/log.niddleware";

const router = express.Router();

router.post("/", VerifyToken, AdminGuard, createPeakSeasonRate);
router.put("/:peakSeasonId", VerifyToken, AdminGuard, updatePeakSeasonRate);
router.delete("/:peakSeasonId/delete", VerifyToken, AdminGuard, deletePeakSeasonRate);
router.get("/", VerifyToken, AdminGuard, getTenantPeakSeasons);

export default router;
