import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { OAuth2Client } from "google-auth-library";

import userRoute from "./routes/user.route.js";
// import User from "./models/User.js"; // <-- ensure you import your User model if you use it

const client = new OAuth2Client(
  "200124904066-qoobaps3o4n4fcmj5l48bulorgo7lvaq.apps.googleusercontent.com"
);

dotenv.config({ path: path.resolve("./.env") });

const app = express();
const PORT = process.env.PORT || 5000;
const URI = process.env.MongoDBURI;

if (!URI) {
  console.error("MongoDB URI missing");
  process.exit(1);
}

// MongoDB connection
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // allow both React dev ports
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/user", userRoute);

// Google Login
app.post("/user/google-login", async (req, res) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience:
        "200124904066-qoobaps3o4n4fcmj5l48bulorgo7lvaq.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload(); // { email, name, picture, ... }

    // TODO: Check if user exists or create a new one
    // const user = await User.findOrCreateFromGoogle(payload);

    res.json({ user: payload }); // replace with actual user object
  } catch (err) {
    res.status(401).json({ message: "Invalid Google token" });
  }
});

// Root
app.get("/", (_req, res) => res.send("API running"));

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
