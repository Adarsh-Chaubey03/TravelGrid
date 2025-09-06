import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { handleError } from './utils/errorHandler.js';
import securityMiddleware from './middleware/securityMiddleware.js';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import saveRoutes from './routes/saveRoutes.js';
import tripRoutes from './routes/trips.js';
import reviewsRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// DB Connection
connectDB();

// Middleware
// Security middleware
app.use(helmet()); // Basic security headers
app.use(securityMiddleware.sanitizeInputs);
app.use(securityMiddleware.xssProtection);
app.use(securityMiddleware.securityHeaders);

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
  credentials: true,
  exposedHeaders: ['CSRF-Token']
}));

app.use(express.json({ limit: '10kb' })); // Body size limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Rate limiting
app.use('/api', securityMiddleware.rateLimiter.api);
app.use('/api/auth', securityMiddleware.rateLimiter.auth);


app.get('/',(req,res)=>{
  res.send("TravelGrid Server is Running")
})

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is running smoothly!' });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

app.use('/api/bookings', bookingRouter)

//Posts Route
app.use('/api/post',postRoutes);

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
  res.status(404).json({
    success: false,
    error: {
      type: 'NotFoundError',
      message: 'Resource not found'
    }
  });
});

// Global error handling middleware
app.use(handleError);

// server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});