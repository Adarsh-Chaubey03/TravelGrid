import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

(async () => {
  try {
    if (!uri) {
      console.error('No MongoDB URI found in .env (MONGO_URI or MONGODB_URI)');
      process.exit(2);
    }

    console.log('Attempting to connect to MongoDB URI:', uri.replace(/:[^:@]+@/, ':*****@'));

    // Use a short serverSelectionTimeoutMS to fail fast for diagnostics
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Successfully connected to MongoDB');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB connection test failed:');
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
