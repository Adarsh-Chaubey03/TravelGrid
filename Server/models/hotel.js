const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number }, 
  image: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
