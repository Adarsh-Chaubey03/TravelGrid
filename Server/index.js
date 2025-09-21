import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import userRoute from "./routes/user.route.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client("200124904066-qoobaps3o4n4fcmj5l48bulorgo7lvaq.apps.googleusercontent.com");


dotenv.config({ path: path.resolve("./.env") });

const app = express();
const PORT = process.env.PORT || 5000;
const URI = process.env.MongoDBURI;

if (!URI) {
  console.error("MongoDB URI missing");
  process.exit(1);
}

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => { console.error(err); process.exit(1); });

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // allow both React dev ports
    credentials: true,
  })
);



app.use(express.json());

app.use("/user", userRoute);


app.post("/user/google-login", async (req, res) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: "200124904066-qoobaps3o4n4fcmj5l48bulorgo7lvaq.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload(); // { email, name, picture, ... }

    // Check if user exists or create a new one
    const user = await User.findOrCreateFromGoogle(payload);
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid Google token" });
  }
});

app.get("/", (_req, res) => res.send("API running"));
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
