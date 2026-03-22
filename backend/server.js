const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dns = require('dns');

// Use Google Public DNS to bypass ISP blocking MongoDB SRV lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load env vars FIRST before importing routes/services
dotenv.config();

const errorMiddleware = require('./middlewares/error.middleware');
const analyzeRoutes = require('./routes/analyze.routes');
const AppError = require('./utils/AppError');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analyze', analyzeRoutes);

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/codebase-agent';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
