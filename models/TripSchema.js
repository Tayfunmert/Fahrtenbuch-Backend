import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    vehicle: {  // Changed from licensePlate
      type: String,
      required: true,
    },
    startMileage: {  // Changed from startKilometer
      type: Number,
      required: true,
    },
    endMileage: {  // Changed from endKilometer
      type: Number,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Automatically calculate the distance before saving
TripSchema.pre("save", function (next) {
  this.distance = this.endMileage - this.startMileage;
  next();
});

const Trip = mongoose.model("Trip", TripSchema);
export default Trip;
