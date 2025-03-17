import express from "express";
import { searchProperties } from "@/controllers/search.controller";
import { searchAlternate } from "@/controllers/search.alternate";
import { searchAlternate2 } from "@/controllers/search2.controller";

const router = express.Router();

router.get("/search", searchAlternate);
// router.get("/search", searchAlternate2);


export default router;