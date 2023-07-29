import express from "express";
import { requireAuth } from "../middleware/auth";

import * as userController from '../controllers/users'
import user from "../models/user";

const router = express.Router()
router.post('/logout', userController.logout)
router.post('/signup', userController.Signup)
router.post('/login', userController.login)
router.get('/', requireAuth, userController.getauthenticatedUser)

export default router
