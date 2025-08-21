const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: String,
  location: String,
  category: String,
  // Add other fields as needed
});

module.exports = mongoose.model('Place', placeSchema);