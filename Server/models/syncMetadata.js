import mongoose from 'mongoose';

const syncMetadataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  deviceId: {
    type: String,
    required: true,
    index: true
  },
  dataType: {
    type: String,
    enum: ['itinerary', 'checklist', 'budget', 'moodboard', 'trip', 'all'],
    required: true
  },
  lastSyncTimestamp: {
    type: Date,
    default: Date.now
  },
  deviceInfo: {
    userAgent: String,
    platform: String,
    appVersion: String
  },
  syncStatus: {
    type: String,
    enum: ['synced', 'pending', 'conflict', 'error'],
    default: 'synced'
  }
}, {
  timestamps: true
});

// Index for efficient querying
syncMetadataSchema.index({ userId: 1, deviceId: 1, dataType: 1 });

export const SyncMetadata = mongoose.model('SyncMetadata', syncMetadataSchema);