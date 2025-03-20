import express from "express";
import { searchProperties } from "../controllers/search.controller";
import { searchAlternate } from "../controllers/search.alternate";
import { searchAlternate2 } from "../controllers/search2.controller";
import { searchQueryUpdate } from "../controllers/fixedSearch.controller";

const router = express.Router();

router.get("/search", searchAlternate2);
router.get("/search-filter", searchAlternate); //loc & Date

// router.get("/search", searchQueryUpdate); //price

export default router;