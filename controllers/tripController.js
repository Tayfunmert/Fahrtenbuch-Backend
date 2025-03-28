import Trip from "../models/TripSchema.js";

// 🟢 Neue Fahrt anlegen
export const createTrip = async (req, res) => {
  const { date, vehicle, startLocation, endLocation, startMileage, endMileage, purpose } = req.body;

  if (!date || !vehicle || !startLocation || !endLocation || !startMileage || !endMileage || !purpose) {
    return res.status(400).json({ message: "Alle Felder sind erforderlich!" });
  }

  try {
    const trip = new Trip({
      driver: req.user._id,
      date,
      vehicle,
      startLocation,
      endLocation,
      startMileage,
      endMileage,
      distance: endMileage - startMileage,
      purpose,
    });

    const savedTrip = await trip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(500).json({ message: "Serverfehler", error });
  }
};

// 🟢 Alle Fahrten abrufen (Admin)
export const getTrips = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Nicht autorisiert!" });
    }

    const trips = await Trip.find().populate("driver", "name email");
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Serverfehler", error });
  }
};

// 🟢 Eigene Fahrten abrufen (Fahrer)
export const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ driver: req.user._id });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Serverfehler", error });
  }
};

// 🟢 Fahrt aktualisieren
export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Fahrt nicht gefunden!" });
    }

    if (trip.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Nicht autorisiert!" });
    }

    trip.date = req.body.date || trip.date;
    trip.vehicle = req.body.vehicle || trip.vehicle;
    trip.startLocation = req.body.startLocation || trip.startLocation;
    trip.endLocation = req.body.endLocation || trip.endLocation;
    trip.startMileage = req.body.startMileage || trip.startMileage;
    trip.endMileage = req.body.endMileage || trip.endMileage;
    trip.distance = trip.endMileage - trip.startMileage;
    trip.purpose = req.body.purpose || trip.purpose;

    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: "Serverfehler", error });
  }
};

// 🟢 Fahrt löschen
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Fahrt nicht gefunden!" });
    }

    if (trip.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Nicht autorisiert!" });
    }

    await trip.deleteOne();
    res.json({ message: "Fahrt gelöscht!" });
  } catch (error) {
    res.status(500).json({ message: "Serverfehler", error });
  }
};
