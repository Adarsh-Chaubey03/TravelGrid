import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number }, 
  image: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default Hotel = mongoose.model('Hotel', hotelSchema);
