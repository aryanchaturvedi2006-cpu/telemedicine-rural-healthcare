const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/patients/register
router.post('/register', async (req, res) => {
  try {
    const { name, age, gender, mobile, street, village, state } = req.body;

    // Check if mobile already exists
    const [existing] = await pool.query('SELECT id FROM patients WHERE TRIM(mobile) = TRIM(?)', [mobile]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Mobile number already registered' });
    }

    const [result] = await pool.query(
      'INSERT INTO patients (name, age, gender, mobile, street, village, state) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, age, gender, mobile, street, village, state]
    );

    res.status(201).json({ success: true, patientId: result.insertId });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/patients/login
router.post('/login', async (req, res) => {
  try {
    const { mobile } = req.body;

    const [patients] = await pool.query('SELECT * FROM patients WHERE TRIM(mobile) = TRIM(?)', [mobile]);
    
    if (patients.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.status(200).json({ success: true, data: patients[0] });
  } catch (error) {
    console.error('Error logging in patient:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
