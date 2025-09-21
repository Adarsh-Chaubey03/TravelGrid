import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: String,
  location: String,
  category: String,
  // Add other fields as needed
});

export const Place = mongoose.model('Place', placeSchema);