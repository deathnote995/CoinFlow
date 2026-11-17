import { Router } from "express";
import { getAnalyticsSummary } from "../controllers/analytics.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router=Router()

router.use(protect)

router.get('/summary',getAnalyticsSummary)

export default router 