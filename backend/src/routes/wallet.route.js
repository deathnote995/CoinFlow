import { createWallet, getUserWallets, getDashboardSummary } from "../controllers/wallet.controller.js";
import { Router } from "express";

const router=Router()

router.post('/',createWallet)
router.get('/user/:userId',getUserWallets)
router.get('/summary/:userId',getDashboardSummary)

export default router