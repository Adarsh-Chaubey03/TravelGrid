import '../config/loadEnv.js';
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
console.log('Using Mongo URI:', !!uri ? uri.replace(/:(.*?)@/, ':*****@') : 'MISSING');

(async () => {
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected (test) - host:', conn.connection.host);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection test failed:');
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    if (err.reason) console.error('Reason:', err.reason);
    if (err.stack) console.error(err.stack);
    process.exit(2);
  }
})();