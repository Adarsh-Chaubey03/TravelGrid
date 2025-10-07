import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Support both env var names used in different examples: MONGO_URI or MONGODB_URI
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MongoDB connection string is missing. Please set MONGO_URI or MONGODB_URI in your .env');
    }

    await mongoose.connect(uri, {
      // useNewUrlParser/useUnifiedTopology are no longer required in newer mongoose versions but safe to include
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
      