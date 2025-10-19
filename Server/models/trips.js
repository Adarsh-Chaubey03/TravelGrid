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
  // Collaborative features
  collaborators: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'editor', 'viewer'],
      default: 'editor'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isCollaborative: {
    type: Boolean,
    default: false
  },
  collaborationToken: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

export const Trip = mongoose.model('Trip', tripSchema);