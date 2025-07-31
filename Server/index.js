const express = require('express');
const bookingRoutes = require("./routes/booking.js");
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes')
const saveRoutes = require('./routes/saveRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// DB Connection
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://travel-grid.vercel.app'
    : '*',
  credentials: true
}));


app.use(express.json());

app.get('/',(req,res)=>{
  res.send("Hello world")
})

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is running smoothly!' });
});
// Authentication Routes
app.use('/api/auth', authRoutes);
//hotel bookings 
app.use("/api/bookings", bookingRoutes);

//Posts Route
app.use('/api/post',postRoutes);

//save Route
app.use('/api/save', saveRoutes);

// 404 Not Found middleware
app.use((req,res,next)=>{
  res.status(404).json({message:'Resource not found'});
});
// Error handling middleware global
app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(500).json({message:"Internal Server Error"});

});

// server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
