import mongoose from 'mongoose';

const safetyPreferenceSchema = new mongoose.Schema({
  preferenceType: {
    type: String,
    enum: ['avoid_high_risk', 'avoid_political_unrest', 'avoid_natural_disasters', 'avoid_health_risks', 'custom'],
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  customValue: String
});

const trustedContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  relationship: String,
  isEmergencyContact: {
    type: Boolean,
    default: false
  }
});

const safetyCheckInSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: [Number]
  },
  status: {
    type: String,
    enum: ['checked_in', 'missed', 'confirmed_safe'],
    default: 'checked_in'
  }
});

const travelerSafetyProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  safetyPreferences: [safetyPreferenceSchema],
  trustedContacts: [trustedContactSchema],
  emergencyContacts: [trustedContactSchema],
  lastCheckIn: safetyCheckInSchema,
  safetyRadius: {
    type: Number,
    default: 50 // in kilometers
  },
  sosEnabled: {
    type: Boolean,
    default: true
  },
  autoCheckInEnabled: {
    type: Boolean,
    default: false
  },
  checkInFrequency: {
    type: Number,
    default: 24 // in hours
  },
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
travelerSafetyProfileSchema.index({ userId: 1 });
travelerSafetyProfileSchema.index({ 'trustedContacts.email': 1 });

// Update the updatedAt field before saving
travelerSafetyProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const TravelerSafetyProfile = mongoose.model('TravelerSafetyProfile', travelerSafetyProfileSchema);