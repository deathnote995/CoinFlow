import {  userThemeUpdate, getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import express from 'express'
import { protect } from "../middlewares/auth.middleware.js";

const router=express.Router()

router.use(protect)

// router.post('/',createUser) --> moved to auth.route.js
router.patch('/theme',userThemeUpdate)
router.get('/profile',getUserProfile)
router.put('/profile',updateUserProfile)

export default router