import express from 'express';
import { Trip } from '../models/trips.js';

const router = express.Router();

// Get shareable trip by ID (public route)
router.get('/trip/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate('userId', 'name email')
      .select('-__v');
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({
      success: true,
      trip: {
        destination: trip.destination,
        country: trip.country,
        numberOfDays: trip.numberOfDays,
        startDate: trip.startDate,
        interests: trip.interests,
        plan: trip.plan,
        createdBy: trip.userId?.name || 'Anonymous'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;