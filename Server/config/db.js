import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use a local MongoDB instance or MongoDB Atlas connection string
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travelgrid", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.log("Server will start without database connection...");
    // Don't exit the process, allow server to start without DB
  }
};

export default connectDB;