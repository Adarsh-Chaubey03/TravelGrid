import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minLength: [2, 'Name must be at least 2 characters'],
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  picture: {
    type: String,
    default: ''
  },
  googleId: {
    type: String,
    sparse: true,
    index: true
  },
  isGoogleUser: {
    type: Boolean,
    default: function() {
      return !!this.googleId;
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: function() {
      return !!this.googleId;
    }
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  savedPlaces: [{
    placeId: {
      type: String,
      required: true
    },
    name: String,
    description: String,
    image: String
  }],
  plannedTrips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  }],
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'es', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'de']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Add comparePassword method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Add instance method to return public user data
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    picture: this.picture,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
    isGoogleUser: this.isGoogleUser,
    language: this.language,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin
  };
};

export const User = mongoose.model('User', userSchema);

