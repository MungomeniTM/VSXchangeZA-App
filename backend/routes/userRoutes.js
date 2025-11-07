import express from "express";
import { updateUser, getProfile } from "../controllers/userController.js";
import { authMiddleware } from "../controllers/authController.js";

const router = express.Router();

// Get current user profile
router.get("/me", authMiddleware, getProfile);

// Update user profile
router.put("/update", authMiddleware, updateUser);

export default router;