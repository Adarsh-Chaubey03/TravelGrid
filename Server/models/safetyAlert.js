import mongoose from 'mongoose';

const safetyAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true,
    index: true
  },
  alertType: {
    type: String,
    enum: ['weather', 'political', 'health', 'security', 'natural_disaster', 'infrastructure', 'custom'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
      required: true
    }
  },
  affectedAreas: [{
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon']
    },
    coordinates: [[Number]]
  }],
  recommendations: [{
    type: String
  }],
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
safetyAlertSchema.index({ userId: 1, createdAt: -1 });
safetyAlertSchema.index({ destination: 1, isActive: 1 });
safetyAlertSchema.index({ alertType: 1, severity: 1 });

// Update the updatedAt field before saving
safetyAlertSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const SafetyAlert = mongoose.model('SafetyAlert', safetyAlertSchema);