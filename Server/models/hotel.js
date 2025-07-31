const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  rating: Number,
  image: String,
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema); 