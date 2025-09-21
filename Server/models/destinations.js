import mongoose from 'mongoose'
const destinationSchema = new mongoose.Schema({
  destination: { type: String, required: true, unique: true },
  avgFlight: Number,
  avgHotelPerNight: Number,
  avgFoodPerDay: Number,
  avgTransportPerDay: Number
});

export default Destination = mongoose.model("Destination", destinationSchema);

