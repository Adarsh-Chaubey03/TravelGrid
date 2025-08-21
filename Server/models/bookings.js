const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or whatever your user model is
    required: true,
  },
  hotelId: {
    type: String,
    ref: "Hotel", // If you have a Hotel model
    required: true,
  },
  name: String,
  email: String,
  phone: String,
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const HotelBooking = mongoose.model("HotelBooking", bookingSchema);
module.exports=HotelBooking;
