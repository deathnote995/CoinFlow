import { createWallet } from "../controllers/wallet.controller.js";
import { Router } from "express";

const router=Router()

router.post('/',createWallet)

export default router