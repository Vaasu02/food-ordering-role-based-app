// backend/server.js

// 1. Load environment variables first
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db'); // Our database connection function
const cors = require('cors'); // For allowing cross-origin requests
const helmet = require('helmet'); // For basic security headers
require('express-async-errors'); // To simplify async error handling

// ----------------------------------------------------
// Database Connection
// ----------------------------------------------------
connectDB();

// ----------------------------------------------------
// Express App Initialization & Middleware
// ----------------------------------------------------
const app = express();

// Security Middleware
app.use(helmet());

// CORS Middleware: Allow all origins for development
// In production, you might restrict this to your frontend domain
app.use(cors());

// Body Parser Middleware: Allows the app to read JSON data from the request body
app.use(express.json());

// ----------------------------------------------------
// Base Route (Health Check)
// ----------------------------------------------------
app.get('/', (req, res) => {
  res.send('Food Ordering API is running...');
});

// ----------------------------------------------------
// Mount Routes (We will add these next)
// ----------------------------------------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurant')); // <-- ADD THIS LINE
app.use('/api/orders', require('./routes/order')); // Placeholder for next step
app.use('/api/payments', require('./routes/payment')); // Placeholder for later step
// ... other routes

// ----------------------------------------------------
// Error Handling Middleware (Must be the last middleware)
// ----------------------------------------------------
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler); // We will define this next

// ----------------------------------------------------
// Start Server
// ----------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});