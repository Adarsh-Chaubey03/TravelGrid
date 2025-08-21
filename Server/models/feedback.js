const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'TravelPackage' },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema); 