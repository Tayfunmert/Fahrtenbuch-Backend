import express from "express";
import { createTrip, getTrips, getUserTrips, updateTrip, deleteTrip } from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Neue Fahrt anlegen (nur Fahrer)
router.post("/", protect, createTrip);

// 🟢 Alle Fahrten abrufen (nur Admin)
router.get("/", protect, getTrips);

// 🟢 Eigene Fahrten abrufen (nur Fahrer)
router.get("/mytrips", protect, getUserTrips);

// 🟢 Fahrt bearbeiten (nur eigene Fahrten)
router.put("/:id", protect, updateTrip);

// 🟢 Fahrt löschen (nur eigene Fahrten)
router.delete("/:id", protect, deleteTrip);

export default router;
