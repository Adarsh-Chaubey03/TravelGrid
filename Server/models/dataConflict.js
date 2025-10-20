import mongoose from 'mongoose';

const conflictResolutionSchema = new mongoose.Schema({
  strategy: {
    type: String,
    enum: ['accept_local', 'accept_remote', 'merge', 'manual'],
    required: true
  },
  resolvedBy: {
    type: String,
    enum: ['system', 'user'],
    required: true
  },
  resolvedAt: Date,
  resolutionData: mongoose.Schema.Types.Mixed
});

const dataConflictSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  dataType: {
    type: String,
    required: true
  },
  dataId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  localVersion: {
    timestamp: Date,
    data: mongoose.Schema.Types.Mixed,
    deviceId: String
  },
  remoteVersion: {
    timestamp: Date,
    data: mongoose.Schema.Types.Mixed,
    deviceId: String
  },
  conflictType: {
    type: String,
    enum: ['edit_conflict', 'delete_conflict', 'structure_conflict'],
    required: true
  },
  resolution: conflictResolutionSchema,
  status: {
    type: String,
    enum: ['pending', 'resolved', 'discarded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for efficient querying
dataConflictSchema.index({ userId: 1, status: 1 });

export const DataConflict = mongoose.model('DataConflict', dataConflictSchema);