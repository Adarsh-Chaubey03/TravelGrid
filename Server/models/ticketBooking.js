import mongoose from 'mongoose';

const ticketBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  depart: { type: Date, required: true },
  return: { type: Date },
  passengers: { type: Number, required: true },
  cabin: { type: String, default: 'Economy' },
  travelType: { type: String, enum: ['flight', 'train', 'bus', 'cab'], required: true },
  tripMode: { type: String, enum: ['oneWay', 'roundTrip'], required: true },
}, { timestamps: true });

const TicketBooking = mongoose.model('TicketBooking', ticketBookingSchema);

export { TicketBooking };
export default TicketBooking;