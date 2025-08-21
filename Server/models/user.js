const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Only required if not Google user
      },
      minlength: 8,
    },
    googleId: {
      type: String,
      index: true,
      sparse: true, // Allows multiple null values
    },
    picture: {
      type: String,
    },
    isGoogleUser: {
      type: Boolean,
      default: function () {
        return !!this.googleId;
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: function() {
        return !!this.googleId; // Google users are pre-verified
      },
    },
    emailVerificationCode: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    savedPlaces: [
      {
        placeId: {
          type: String,
          required: true,
        },
        name: String,
        description: String,
        image: String,
      },
    ],

     plannedTrips: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
      },
    ],
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'es', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'de']
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
