import express from "express";
import { loginUser, getUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser); // Login mit Benutzername & Passwort
router.get("/profile", protect, getUserProfile); // Geschützter Endpunkt für Benutzerprofil

export default router;
