const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { db } = require('./db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/jobs', jobRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database connected at ${path.join(__dirname, '../data/vikasini.db')}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Close DB on process termination
process.on('SIGINT', () => {
  db.close();
  console.log('Database connection closed');
  process.exit(0);
});

module.exports = app; 