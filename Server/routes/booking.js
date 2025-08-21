const express= require('express');
const Booking =require("../models/bookings.js");
const mongoose = require('mongoose');
const verifyJWT = require('../middleware/auth.js')

const router = express.Router();

// Create a booking
router.post("/", async (req, res) => {
  try {
    const { user, hotelId, name, email, phone, checkIn, checkOut, guests } = req.body;

    if (!user || !hotelId) {
      return res.status(400).json({ error: "User ID and Hotel ID are required." });
    }

    const newBooking = new Booking({
      user: new mongoose.Types.ObjectId(user),
      hotelId,
      name,
      email,
      phone,
      checkIn,
      checkOut,
     guests: parseInt(guests, 10), 
    });

    await newBooking.save();
    console.log("Booking saved successfully:", newBooking);
    res.status(201).json({ message: "Booking confirmed", booking: newBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Booking failed" });
  }
});

// Get bookings for a user (used in profile)
router.get("/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch bookings" });
  }
});

module.exports = router;
