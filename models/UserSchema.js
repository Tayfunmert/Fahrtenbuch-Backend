import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["driver", "admin"],
      default: "driver",
    },
  },
  { timestamps: true }
);

// 🛑 Verhindert doppeltes Hashing
UserSchema.pre("save", async function (next) {
  console.log("🔍 Pre-Save Hook wird aufgerufen...");
  console.log("Aktuelles Passwort vor Hashing:", this.password);

  // Falls das Passwort schon gehasht ist, wird es nicht erneut gehasht
  if (!this.isModified("password") || this.password.startsWith("$2b$")) {
    console.log("🔍 Passwort ist bereits gehasht. Überspringe Hashing.");
    return next();
  }

  console.log("🔍 Passwort wird gehasht...");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  console.log("✅ Passwort nach Hashing:", this.password);
  next();
});

// Methode zur Passwortprüfung
UserSchema.methods.matchPassword = async function (enteredPassword) {
  console.log("🔍 Passwortprüfung:", enteredPassword, this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
