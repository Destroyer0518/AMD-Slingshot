require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Fundamental Route Structure
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/patients', require('./routes/patients'));
// app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/consultations', require('./routes/consultationRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));

// Health check endpoint (Cloud Run ready)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Stateless server listen - uses Cloud Run provided PORT or falls back to 8080
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// Handle graceful shutdown for containers
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
