import User from "../models/UserSchema.js";
import jwt from "jsonwebtoken";

// JWT erstellen
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 🟢 Benutzer-Login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("🔍 Login-Versuch:", username, password);
    const user = await User.findOne({ username });

    if (!user) {
      console.log("❌ Benutzer nicht gefunden!");
      return res.status(401).json({ message: "Benutzer nicht gefunden!" });
    }

    console.log("✅ Benutzer gefunden:", user);

    const isMatch = await user.matchPassword(password);
    console.log("🔍 Passwortvergleich Ergebnis:", isMatch);

    if (!isMatch) {
      console.log("❌ Falsches Passwort!");
      return res.status(401).json({ message: "Falsches Passwort!" });
    }

    console.log("✅ Login erfolgreich!");
    res.json({
      _id: user.id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("❌ Fehler beim Login:", error);
    res.status(500).json({ message: "Serverfehler", error });
  }
};


// 🟢 Benutzerprofil abrufen
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      res.json({
        _id: user.id,
        username: user.username,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: "Benutzer nicht gefunden!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Serverfehler", error });
  }
};
