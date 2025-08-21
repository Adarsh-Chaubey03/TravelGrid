const Trip = require('../models/trips.js');
const User = require('../models/user');

// POST /api/trips - Save a trip
exports.createTrip = async (req, res) => {
  try {
    const userId = req.user._id;

    const trip = new Trip({
      ...req.body,
      userId,
    });

    await trip.save();

    // ✅ Link trip to the user's plannedTrips array
    await User.findByIdAndUpdate(userId, {
      $push: { plannedTrips: trip._id },
    });

    res.status(201).json({ message: 'Trip saved successfully', trip });
  } catch (error) {
    console.error('Create Trip Error:', error);
    res.status(500).json({ message: 'Failed to save trip' });
  }
};
// GET /api/trips - Get trips only for logged-in user
exports.getAllTrips = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ Logged-in user
    const trips = await Trip.find({ userId }).sort({ _id: -1 }); // ✅ Only this user's trips
    res.status(200).json(trips);
  } catch (error) {
    console.error('Fetch Trips Error:', error);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
};

// DELETE /api/trips/:id - Delete only if user owns the trip
exports.deleteTrip = async (req, res) => {
  try {
    const userId = req.user._id;
    const tripId = req.params.id;

    const deletedTrip = await Trip.findOneAndDelete({ _id: tripId, userId });

    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found or not authorized' });
    }

    // ✅ Remove reference from User
    await User.findByIdAndUpdate(userId, {
      $pull: { plannedTrips: tripId },
    });

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete Trip Error:', error);
    res.status(500).json({ message: 'Failed to delete trip' });
  }
};
