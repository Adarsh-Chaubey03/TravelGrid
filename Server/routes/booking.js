import express from 'express'
import Booking from '../models/booking.js'
import mongoose from 'mongoose';
import {verifyJWT} from '../middleware/auth.js'

const router = express.Router();

// Create a booking (protected)
router.post("/", verifyJWT, async (req, res) => {
  try {
    const { userId, startingDate, endingDate, destination, noOfRooms, noOfPeople } = req.body;

    if (!userId || !destination) {
      return res.status(400).json({ error: "userId and destination are required." });
    }

    const newBooking = new Booking({
      userId: new mongoose.Types.ObjectId(userId),
      startingDate,
      endingDate,
      destination,
      noOfRooms: parseInt(noOfRooms, 10) || 1,
      noOfPeople: parseInt(noOfPeople, 10) || 1,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking confirmed", booking: newBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Booking failed" });
  }
});

// Get bookings for a user (used in profile)
// Get bookings for a user (used in profile)
router.get("/:userId", verifyJWT, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).lean();
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: "Could not fetch bookings" });
  }
});

export default router
