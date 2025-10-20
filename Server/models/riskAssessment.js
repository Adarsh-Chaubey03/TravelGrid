import mongoose from 'mongoose';

const riskFactorSchema = new mongoose.Schema({
  factorType: {
    type: String,
    enum: ['weather', 'political', 'health', 'security', 'natural_disaster', 'infrastructure', 'crime'],
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  description: String,
  source: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const riskAssessmentSchema = new mongoose.Schema({
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
  overallRiskScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  riskFactors: [riskFactorSchema],
  safetyRecommendations: [{
    type: String
  }],
  lastAssessment: {
    type: Date,
    default: Date.now
  },
  nextAssessment: Date,
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
  travelPeriod: {
    startDate: Date,
    endDate: Date
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
riskAssessmentSchema.index({ userId: 1, createdAt: -1 });
riskAssessmentSchema.index({ destination: 1, lastAssessment: -1 });
riskAssessmentSchema.index({ overallRiskScore: 1 });

// Update the updatedAt field before saving
riskAssessmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const RiskAssessment = mongoose.model('RiskAssessment', riskAssessmentSchema);