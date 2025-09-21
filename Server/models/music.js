import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['romantic', 'energetic', 'relaxing', 'adventure', 'party', 'workout', 'sleep'],
    default: 'romantic'
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    default: "0:00"
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  addedByUsername: {
    type: String,
    required: true
  },
  addedDate: {
    type: Date,
    default: Date.now
  },
  playCount: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
musicSchema.index({ type: 1, addedDate: -1 });
musicSchema.index({ addedBy: 1 });
musicSchema.index({ title: 'text', artist: 'text' });

export const Music = mongoose.model('Music', musicSchema);
