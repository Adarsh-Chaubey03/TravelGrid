const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Process.env se MONGO_URI le raha hai
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not defined in .env file');
    }

    // Simple connection (new driver options default hai)
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
