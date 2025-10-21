import mongoose from 'mongoose';

/**
 * connectDB
 * - Tries to connect to MongoDB with retries
 * - Exports a function that resolves when connected or rejects after attempts
 */
export const connectDB = async ({ retries = 5, delayMs = 2000 } = {}) => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MongoDB connection string is missing. Please set MONGO_URI or MONGODB_URI in your .env');
  }

  // Recommended options
  const opts = {
    // options kept minimal for mongoose v6+: driver handles the defaults
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  let attempt = 0;
  while (attempt < retries) {
    try {
      attempt += 1;
      console.log(`Connecting to MongoDB (attempt ${attempt}/${retries})...`);
      await mongoose.connect(uri, opts);

      // Attach event handlers
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });

      console.log('✅ MongoDB connected');
      return;
    } catch (err) {
      console.error(`MongoDB connect attempt ${attempt} failed:`, err.message || err);
      if (attempt >= retries) {
        console.error('Exceeded maximum MongoDB connection attempts.');
        throw err;
      }
      // wait before retrying
      await new Promise((res) => setTimeout(res, delayMs * attempt));
    }
  }
};
      