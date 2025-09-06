import mongoose from 'mongoose';

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
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const User = mongoose.model('User', userSchema);

export default User;