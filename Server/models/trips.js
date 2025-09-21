import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  country: String,
  destination: String,
  numberOfDays: Number,
  startDate: String,
  interests: [String],
  plan: {
    destination: String,
    numberOfDays: Number,
    startDate: String,
    days: [
      {
        day: Number,
        title: String,
        activities: [String],
        meals: {
          breakfast: String,
          lunch: String,
          dinner: String,
        },
      },
    ],
  },
}, {
  timestamps: true
});

export const Trip = mongoose.model('Trip', tripSchema);


