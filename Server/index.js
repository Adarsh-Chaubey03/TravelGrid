import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Routes
import { connectDB } from './config/db.js';
import { securityMiddleware } from './middleware/securityMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import emailVerificationRoutes from './routes/emailVerificationRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import saveRoutes from './routes/saveRoutes.js';
import tripRoutes from './routes/trips.js';
import reviewsRoutes from './routes/reviewRoutes.js';
import languageRoutes from './routes/languageRoutes.js';
import moodBoardRoutes from './routes/moodBoardRoutes.js';
import searchRoutes from './routes/search.js';
import currencyRoutes from './routes/currencyRoutes.js';
import musicRoutes from './routes/musicRoutes.js';
import resetPassword from './routes/resetPassword.js';

dotenv.config({ path: path.resolve('./.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const URI = process.env.MongoDBURI;

// Connect to MongoDB
if (!URI) {
  console.error("MongoDB URI missing");
  process.exit(1);
}

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => { console.error(err); process.exit(1); });

// Allowed CORS origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://travel-grid.vercel.app"
];

// Middleware
if (process.env.NODE_ENV !== 'test') app.use(morgan('combined'));
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(securityMiddleware.sanitizeInputs);
app.use(securityMiddleware.xssProtection);
app.use(securityMiddleware.securityHeaders);

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', generalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// Health check
app.get('/api/health', (_req, res) => res.status(200).json({ message: 'API is running smoothly!' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailVerificationRoutes);
app.use('/api/bookings', bookingRouter);
app.use('/api/post', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/save', saveRoutes);
app.use('/api', tripRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/language', languageRoutes);
app.use('/api/moodboards', moodBoardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/forgot-password', resetPassword);

// 404 Not Found
app.use((_req, res) => res.status(404).json({ message: 'Resource not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  if (process.env.NODE_ENV !== 'production') console.error(err);
  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;
  res.status(status).json({ message });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
