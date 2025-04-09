import express from "express";
import { updateProfile } from "../controllers/updateProfile.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

// PATCH request for updating user profile
router.patch("/profile/update", authenticateUser , upload.single("profileImage"), updateProfile);

export default router;