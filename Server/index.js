import './config/loadEnv.js';
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan';
import axios from 'axios'
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// ...existing code...
import { connectDB } from './config/db.js';
import { securityMiddleware } from './middleware/securityMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import emailVerificationRoutes from './routes/emailVerificationRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import saveRoutes from './routes/saveRoutes.js';
import tripRoutes from './routes/trips.js';
import reviewsRoutes from './routes/reviewRoutes.js'
import languageRoutes from './routes/languageRoutes.js';
import moodBoardRoutes from './routes/moodBoardRoutes.js';
import searchRoutes from './routes/search.js';
import currencyRoutes from './routes/currencyRoutes.js';
import musicRoutes from './routes/musicRoutes.js';
import resetPassword from "./routes/resetPassword.js";
import shareRoutes from './routes/shareRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import enhancedSanitizationMiddleware from './middleware/enhancedSanitizationMiddleware.js';
import collaborationHandler from './utils/collaborationHandler.js';
import checklistRoutes from './routes/checklistRoutes.js';

const app = express();
const server = createServer(app); // Create HTTP server for Socket.IO
const PORT = process.env.PORT || 5000;

// DB Connection will be established before starting the server

const startApp = async () => {
    try {
        // Connect to MongoDB first
        await connectDB({ retries: 5, delayMs: 2000 });

        // Register middleware that depends on DB or security afterwards
        app.use(enhancedSanitizationMiddleware);
        app.use(securityMiddleware.sanitizeInputs);
        app.use(securityMiddleware.xssProtection);

        // Authentication Routes
        app.use('/api/auth', authRoutes);

        // Email Verification Routes
        app.use('/api/email', emailVerificationRoutes);

        // Other routes (register after DB connection)
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
        app.use('/api/share', shareRoutes);
        app.use('/api/chatbot', chatbotRoutes);
        app.use('/api/checklist', checklistRoutes);

        // Now start the HTTP server
        startServer();
    } catch (err) {
        console.error('Fatal error during startup:', err && err.message ? err.message : err);
        process.exit(1);
    }
};

startApp();

// Middleware
const allowedOrigins = [
    "http://localhost:5173", // Vite dev
    "http://localhost:5174", // Vite dev (alternative port)
    "http://localhost:3000", // CRA dev
    "https://travel-grid.vercel.app" // Production
];

// Request logging (skip in test)
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// Security headers
app.use(helmet());

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

// EnhancedSanitization 
// app.use(enhancedSanitizationMiddleware);

// Use centralized security middleware
// app.use(securityMiddleware.sanitizeInputs);
// app.use(securityMiddleware.xssProtection);

// Basic rate limiting for auth and general API
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 300 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', generalLimiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, // tighter for auth endpoints
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// Use centralized security headers middleware
// app.use(securityMiddleware.securityHeaders);

// No need for custom audio serving - files are now in client/public/uploads


app.get('/', (req, res) => {
    res.send("Hello world")
})

// Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'API is running smoothly!' });
});

// Test endpoints removed - no longer needed

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

// Language Routes
app.use('/api/language', languageRoutes);

// Mood Board Routes
app.use('/api/moodboards', moodBoardRoutes);

// Search Routes
app.use('/api/search', searchRoutes);

// Currency Routes
app.use('/api/currency', currencyRoutes);

// Music Routes
app.use('/api/music', musicRoutes);

app.use('/api/forgot-password', resetPassword)

// Share Routes
app.use('/api/share', shareRoutes);

// Chatbot Routes
app.use('/api/chatbot', chatbotRoutes);

// 404 Not Found middleware
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Resource not found' });
});

// Error handling middleware global
app.use((err, req, res, next) => {
    // Centralized error handler without leaking stack traces in production
    const status = err.status || 500;
    const response = {
        success: false,
        message: status === 500 ? 'Internal Server Error' : err.message,
    };
    if (process.env.NODE_ENV !== 'production') {
        console.error(err);
        response.stack = err.stack;
    }
    res.status(status).json(response);
});

//API For Train Search 

app.get('/api/trains/search', async (req, res) => {
    const { from, to, date, passengers, cabin } = req.query;

    
    if (!from || !to || !date) {
        return res.status(400).json({ message: 'Missing required query parameters: from, to, date' });
    }
    const [year, month, day] = date.split('-');
    const formattedDate = `${day}-${month}-${year}`; 
   
    console.log(`[DEBUG] Received search request with params:`, { from, to, date, passengers, cabin });
    console.log(`[DEBUG] Original date: ${date}, Reformatted to: ${formattedDate}`);

    
    const options = {
        method: 'GET',
        url: 'https://irctc-api2.p.rapidapi.com/trainAvailability',
      
        params: {
            source: from,
            destination: to,
            date: formattedDate 
        },
        headers: {
           
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        
            'X-RapidAPI-Host': 'irctc-api2.p.rapidapi.com'
        }
    };

    console.log("Attempting to fetch from RapidAPI with the following options:");
   
    console.log({
        url: options.url,
        params: options.params,
        host: options.headers['X-RapidAPI-Host']
    });

   
    try {
      
        const response = await axios.request(options);
    
        if (response.data && Array.isArray(response.data.data)) {
           
            res.status(200).json(response.data.data);
        } else {
           
            res.status(200).json([]);
        }

    } catch (error) {
        console.error("\n--- ERROR FETCHING FROM RAPIDAPI ---");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
            console.error("Headers:", error.response.headers);
        } else if (error.request) {
            console.error("Request Error:", error.request);
        } else {
            console.error('General Error:', error.message);
        }
        console.error("--- END OF ERROR ---");
        res.status(500).json({ 
            message: 'Failed to fetch train data from the external API.',
            error: error.message 
        });
    }
});



// --- BUS SEARCH ENDPOINT (Using data.gov.in) ---
app.get('/api/buses/search', async (req, res) => {
    let { from, to } = req.query;
    
    console.log(`Filtering for From: "${from}", To: "${to}"`); // <-- Add this
   

    if (!from || !to) {
        return res.status(400).json({ message: 'Missing required query parameters: from, to' });
    }

   
    const dataGovResourceUrl = 'https://api.data.gov.in/resource/1f10d3eb-a425-4246-8800-3f72bf7ad2b0';
    
   
    
    let totalRecords = 0;
    try {
        const countResponse = await axios.get(dataGovResourceUrl, {
            params: {
                'api-key': process.env.DATA_GOV_API_KEY,
                'format': 'json',
                'limit': 1
            }
        });
        totalRecords = countResponse.data.total;
    } catch (error) {
        console.error("Error fetching bus data count:", error.message);
        return res.status(500).json({ message: 'Failed to fetch bus data count.' });
    }

    if (totalRecords === 0) {
        return res.status(200).json([]);
    }

    console.log(`Fetching ${totalRecords} bus records from data.gov.in...`);

   
    try {
        const response = await axios.get(dataGovResourceUrl, {
            params: {
                'api-key': process.env.DATA_GOV_API_KEY,
                'format': 'json',
                'limit': totalRecords
            }
        });
        
        const allBuses = response.data.records;
       
        const filteredBuses = allBuses.filter(bus => 
            bus.from?.toLowerCase().includes(from.toLowerCase()) &&
            bus.to?.toLowerCase().includes(to.toLowerCase())
        );

        console.log(`Found ${filteredBuses.length} matching buses.`);
        res.status(200).json(filteredBuses);

    } catch (error) {
        console.error("\n--- ERROR FETCHING FROM DATA.GOV.IN ---");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error('General Error:', error.message);
        }
        res.status(500).json({ 
            message: 'Failed to fetch bus data from data.gov.in.',
            error: error.message 
        });
    }
});


// ---  FLIGHT SEARCH ENDPOINT  ---
app.get('/api/flights/search', async (req, res) => {
    let { from, to, date } = req.query;
    
    console.log(`Searching FLIGHTS from ${from} to ${to}, ignoring date: ${date}`);

    if (!from || !to || !date) {
        return res.status(400).json({ message: 'Missing required query parameters: from (IATA code), to (IATA code), date (YYYY-MM-DD)' });
    }

    const apiKey = process.env.AVIATION_API_KEY;
    if (!apiKey) {
        console.error("AVIATION_API_KEY is not set in environment variables.");
        return res.status(500).json({ message: 'Server configuration error: Flight API key missing.' });
    }

    const aviationStackApiUrl = 'http://api.aviationstack.com/v1/flights';

    const params = {
        access_key: apiKey,
        limit: 100
    };
    
    console.log("Attempting to fetch latest FLIGHT data from AviationStack...");
    try {
        const response = await axios.get(aviationStackApiUrl, { params });

      
        // console.log("Full API Response:", JSON.stringify(response.data, null, 2));


        if (response.data && Array.isArray(response.data.data)) {
            console.log(`Received ${response.data.data.length} flights, now filtering...`);
            
            const allFlights = response.data.data;
            const fromIata = from.toUpperCase();
            const toIata = to.toUpperCase();

            //Filtered the response
            const filteredFlights = allFlights.filter(flight => {
                const departureMatch = flight.departure?.iata === fromIata;
                const arrivalMatch = flight.arrival?.iata === toIata;
               
                
                return departureMatch && arrivalMatch;
            });
           

            console.log(`Found ${filteredFlights.length} flights matching criteria. Sending to frontend.`);
            res.status(200).json(allFlights);

        } else {
            console.log("No flight data found or unexpected format:", response.data);
            res.status(200).json([]);
        }

    } catch (error) {
        console.error("\n--- ERROR FETCHING FLIGHT DATA ---");
        const status = error.response?.status || 500;
        let message = 'Failed to fetch flight data.';
        if (error.response?.data?.error?.message) {
            message = error.response.data.error.message;
            console.error("AviationStack Error:", error.response.data.error);
        } else if (error.response?.data) {
             console.error("Data:", error.response.data);
        } else {
             console.error('General Error:', error.message);
        }
        res.status(status).json({ message, error: error.message });
    }
});


// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // Vite dev
      "http://localhost:5174", // Vite dev (alternative port)
      "http://localhost:3000", // CRA dev
      "https://travel-grid.vercel.app" // Production
    ],
    credentials: true
  }
});

// Set up collaboration handler
collaborationHandler(io);

// server
// Start server with graceful shutdown handling
let httpServer = null;

const startServer = (port = PORT, attempts = 0, maxAttempts = 5) => {
    // If server already listening, do nothing
    if (httpServer && httpServer.listening) return;

    try {
        httpServer = server.listen(port, () => {
            console.log(`✅ Server running on http://localhost:${port} (PID: ${process.pid})`);
        });
    } catch (err) {
        console.error('Failed to bind server:', err);
    }

    // Attach error handler once
    httpServer.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
            console.warn(`⚠️  Port ${port} is already in use.`);
            if (attempts < maxAttempts) {
                const nextPort = port + 1;
                console.warn(`🔁 Trying port ${nextPort} (attempt ${attempts + 1}/${maxAttempts})...`);
                // Close current server if partially opened, then retry
                try {
                    httpServer.close(() => {
                        httpServer = null;
                        setTimeout(() => startServer(nextPort, attempts + 1, maxAttempts), 500);
                    });
                } catch (closeErr) {
                    httpServer = null;
                    setTimeout(() => startServer(nextPort, attempts + 1, maxAttempts), 500);
                }
                return;
            }
            console.error(`❌ All attempts to bind ports starting from ${PORT} failed. Please free the port or set a different PORT in your .env.`);
        }

        // Other errors
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    });
};

startServer();

// Graceful shutdown helper
const gracefulShutdown = (signal) => {
    console.log(`Received ${signal}. Closing server...`);
    if (!httpServer) {
        console.log('Server is not running. Exiting.');
        process.exit(0);
    }
    httpServer.close(async (err) => {
        if (err) {
            console.error('Error during server close:', err);
            process.exit(1);
        }
        try {
            // Close DB connection if mongoose is connected
            const mongoose = await import('mongoose');
            if (mongoose?.connection?.readyState) {
                await mongoose.connection.close(false);
                console.log('MongoDB connection closed.');
            }
        } catch (closeErr) {
            console.error('Error closing MongoDB connection:', closeErr);
        }
        console.log('Shutdown complete. Exiting.');
        process.exit(0);
    });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Global unhandled rejection/exception handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    process.exit(1);
});