import { registerUser, verifyEmailOTP, resetPassword, forgotPassword } from "../controllers/auth.controller.js";
import { Router } from "express";

const router=Router()

router.post('/register',registerUser)
router.post('/verify-otp',verifyEmailOTP)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;