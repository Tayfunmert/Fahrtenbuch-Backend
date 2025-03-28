import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import tripRoutes from "./routes/tripRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./models/UserSchema.js";
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Alternativer Fix mit `cors()` Middleware (falls nötig, sonst entfernen)
app.use(cors());

// ✅ Datenbank verbinden & Admin erstellen
connectDB().then(() => {
  createAdminUser();
});

// ✅ Funktion zum Erstellen des Admins
const createAdminUser = async () => {
  try {
    const adminUsername = "admin";
    const adminPassword = "admin123";

    let admin = await User.findOne({ role: "admin" });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin = new User({
        username: adminUsername,
        password: hashedPassword,
        role: "admin",
      });
      await admin.save();
      console.log("✅ Admin wurde neu erstellt!");
    } else {
      console.log("✅ Admin existiert bereits!");
    }

    console.log(`🔑 Admin-Login: ${adminUsername} | Passwort: ${adminPassword}`);
  } catch (error) {
    console.error("❌ Fehler beim Erstellen des Admins:", error);
  }
};

// ✅ API-Routen definieren
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);

// ✅ Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));
