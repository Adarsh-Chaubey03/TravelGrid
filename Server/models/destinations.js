const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  destination: { type: String, required: true, unique: true },
  avgFlight: Number,
  avgHotelPerNight: Number,
  avgFoodPerDay: Number,
  avgTransportPerDay: Number
});

module.exports = mongoose.model("Destination", destinationSchema);

