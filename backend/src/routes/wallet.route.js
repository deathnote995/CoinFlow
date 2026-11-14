import { createWallet, getUserWallets, getDashboardSummary } from "../controllers/wallet.controller.js";
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";

const router=Router()

router.use(protect)

router.post('/',createWallet)
router.get('/',getUserWallets)
router.get('/dashboard-summary',getDashboardSummary)

export default router