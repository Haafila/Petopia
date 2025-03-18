import express from "express";
import { login, profile, register } from "../controllers/auth.controller.js"; // Import controllers

const router = express.Router();

// Map routes to controller functions
router.post("/login", login);
router.get("/profile", profile);
router.post("/register", register);

export default router;