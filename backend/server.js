const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');
const path = require('path');

// Import Routes
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');
const vaultRoutes = require('./routes/vault');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vault', vaultRoutes);

// Database Connection Test and Server Start
const PORT = process.env.PORT || 5000;

pool.getConnection()
  .then((connection) => {
    console.log('Successfully connected to the MySQL database!');
    connection.release();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  });
