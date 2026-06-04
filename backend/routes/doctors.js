const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// GET /api/doctors/nearby?state=Gujarat
router.get('/nearby', async (req, res) => {
  try {
    const { state } = req.query;
    if (!state) {
      return res.status(400).json({ success: false, message: 'State query parameter is required' });
    }

    const [doctors] = await pool.query(
      'SELECT id, name, specialization, hospital_name, area, is_available FROM doctors WHERE state = ?',
      [state]
    );

    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error('Error fetching nearby doctors:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/doctors/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, specialization, hospital_name, area, state, password } = req.body;

    // Check if email already exists
    const [existing] = await pool.query('SELECT id FROM doctors WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      'INSERT INTO doctors (name, email, mobile, specialization, hospital_name, area, state, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, mobile, specialization, hospital_name, area, state, hashedPassword]
    );

    res.status(201).json({ success: true, message: 'Doctor registered successfully' });
  } catch (error) {
    console.error('Error registering doctor:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/doctors/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [doctors] = await pool.query('SELECT * FROM doctors WHERE email = ?', [email]);
    
    if (doctors.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid credentials' });
    }

    const doctor = doctors[0];
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Remove password before sending
    delete doctor.password;
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    console.error('Error logging in doctor:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/doctors/:id/availability
router.patch('/:id/availability', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { is_available } = req.body;

    if (is_available === undefined) {
      return res.status(400).json({ success: false, message: 'is_available boolean is required' });
    }

    const [result] = await pool.query(
      'UPDATE doctors SET is_available = ? WHERE id = ?',
      [is_available, doctorId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({ success: true, message: 'Availability updated' });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
