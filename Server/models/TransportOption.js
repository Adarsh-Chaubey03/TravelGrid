const mongoose = require('mongoose');

const transportOptionSchema = new mongoose.Schema({
  // Basic information
  type: {
    type: String,
    enum: ['flight', 'train', 'bus', 'car-rental', 'ride-share'],
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  
  // Route information
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  
  // Schedule information
  departureTime: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  
  // Pricing information
  basePrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  dynamicPrice: {
    type: Number,
    required: true
  },
  priceFactors: {
    demand: { type: Number, default: 1 }, // Multiplier based on demand
    timeFactor: { type: Number, default: 1 }, // Multiplier based on time of booking
    seasonFactor: { type: Number, default: 1 } // Multiplier based on season
  },
  
  // Environmental impact
  carbonFootprint: {
    type: Number, // in kg CO2
    required: true
  },
  ecoFriendly: {
    type: Boolean,
    default: false
  },
  
  // Availability
  seatsAvailable: {
    type: Number,
    required: true
  },
  
  // Service details
  amenities: [{
    type: String
  }],
  stops: [{
    location: String,
    arrivalTime: Date,
    departureTime: Date
  }],
  
  // External identifiers
  externalId: {
    type: String
  },
  bookingUrl: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TransportOption', transportOptionSchema);