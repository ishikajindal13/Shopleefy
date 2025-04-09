import express from "express";
import { getUserProfile } from "../controllers/user.controllers.js";

const router = express.Router();

// Route to fetch a user's public profile by their ID
router.get("/profile/:id", getUserProfile);

export default router;