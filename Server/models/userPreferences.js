import mongoose from 'mongoose';

const preferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  travelHistory: [{
    destination: String,
    startDate: Date,
    endDate: Date,
    budget: Number,
    activities: [String],
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  preferredDestinations: [{
    type: String
  }],
  preferredActivities: [{
    type: String
  }],
  budgetRange: {
    min: Number,
    max: Number
  },
  preferredTravelTime: {
    startMonth: Number,  // 1-12
    endMonth: Number     // 1-12
  },
  communicationStyle: {
    type: String,
    enum: ['formal', 'casual', 'enthusiastic', 'concise'],
    default: 'casual'
  },
  languagePreferences: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'fluent']
    }
  }],
  specialInterests: [{
    type: String
  }],
  accessibilityNeeds: [{
    type: String
  }],
  lastInteraction: {
    type: Date,
    default: Date.now
  },
  interactionCount: {
    type: Number,
    default: 0
  },
  sentimentTrend: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  }
}, {
  timestamps: true
});

// Note: userId has `unique: true` which creates an index, so avoid duplicate schema.index() here

export const UserPreferences = mongoose.model('UserPreferences', preferenceSchema);