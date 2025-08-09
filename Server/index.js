const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // <-- NEW
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const emailVerificationRoutes = require('./routes/emailVerificationRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes')
const saveRoutes = require('./routes/saveRoutes');
const tripRoutes = require('./routes/trips.js');
const reviewsRoutes = require('./routes/reviewRoutes.js');

const app = express();
const PORT = process.env.PORT || 5000;

// DB Connection
connectDB();

// Middleware
const allowedOrigins = [
  "http://localhost:5173", // Vite dev
  "http://localhost:3000", // CRA dev
  "https://travel-grid.vercel.app" // Production
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true // <- allow credentials (cookies)
}));

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});


app.get('/', (req, res) => {
  res.send("Hello world")
})

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is running smoothly!' });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Email Verification Routes
app.use('/api/email', emailVerificationRoutes);

app.use('/api/bookings', bookingRouter)

//Posts Route
app.use('/api/post', postRoutes);

// profile update route
app.use('/api/users', userRoutes);

//save Route
app.use('/api/save', saveRoutes);

// Trip Routes
app.use('/api', tripRoutes);

// Reviews Routes
app.use('/api/reviews', reviewsRoutes);

// 404 Not Found middleware
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});
// Error handling middleware global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });

});

// server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
