import {  userThemeUpdate, getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import express from 'express'

const router=express.Router()

// router.post('/',createUser) --> moved to auth.route.js
router.put('/:userId/theme',userThemeUpdate)
router.get('/:userId',getUserProfile)
router.put('/:userId',updateUserProfile)

export default router