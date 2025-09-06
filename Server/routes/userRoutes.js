import express from "express";
const router = express.Router();
import multer from "multer";
import User from "../models/user.js"; // ensure correct path

// Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("bookings"); // bookings field agar hai
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // ya { bookings: user.bookings } agar sirf bookings chahiye
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user data" });
  }
});


// Update user details
router.put("/:id", upload.single("picture"), async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    // Agar picture bheji hai
    if (req.file) {
      // For now store as base64 (ya Cloudinary use kare to url store kare)
      user.picture = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    await user.save();

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user profile" });
  }
});

export default router;