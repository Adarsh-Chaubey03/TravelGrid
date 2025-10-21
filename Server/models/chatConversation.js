import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  entities: {
    type: Map,
    of: String,
    default: {}
  }
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Travel Conversation'
  },
  messages: [messageSchema],
  context: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  preferences: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Index for efficient querying
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ sessionId: 1 });

// Update the updatedAt field before saving
conversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const ChatConversation = mongoose.model('ChatConversation', conversationSchema);