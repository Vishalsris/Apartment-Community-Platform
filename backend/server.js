require('dotenv').config();
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google Public DNS to bypass ISP blocking SRV queries

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Debug (optional - remove later)
console.log("MONGO_URI:", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const eventRoutes = require('./routes/eventRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const businessRoutes = require('./routes/businessRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');

const { errorHandler } = require('./middleware/errorMiddleware');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("API Running");
});

// Error Middleware
app.use(errorHandler);

// ✅ Robust MongoDB Connection Setup
const connectDB = async (retries = 5) => {
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ DB Connected");
      
      // Start server ONLY after DB connects securely
      const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });

      // Handle unhandled promise rejections globally
      process.on('unhandledRejection', (err, promise) => {
        console.error(`❌ Unhandled Rejection: ${err.message}`);
        // Close server & exit process
        server.close(() => process.exit(1));
      });

      break;
    } catch (error) {
      console.error(`❌ MongoDB connection error: ${error.message}`);
      retries -= 1;
      console.log(`🔄 Retries left: ${retries}`);
      if (retries === 0) {
        // Exit process with failure
        process.exit(1); 
      }
      // wait 5 seconds before retrying
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

connectDB();