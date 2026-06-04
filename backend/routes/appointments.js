const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/appointments/book
router.post('/book', async (req, res) => {
  try {
    const { patient_id, doctor_id, date, time, mode, symptoms } = req.body;

    if (!patient_id || !doctor_id || !date || !time || !mode || !symptoms) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const [result] = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, date, time, mode, symptoms) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id, date, time, mode, symptoms]
    );

    res.status(201).json({ success: true, appointmentId: result.insertId });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/appointments/patient/:patientId
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const [appointments] = await pool.query(
      `SELECT a.*, d.name as doctor_name, d.specialization, d.hospital_name 
       FROM appointments a 
       JOIN doctors d ON a.doctor_id = d.id 
       WHERE a.patient_id = ? 
       ORDER BY a.created_at DESC`,
      [patientId]
    );

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/appointments/doctor/:doctorId
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;

    const [appointments] = await pool.query(
      `SELECT a.*, p.name as patient_name, p.age, p.gender, p.mobile 
       FROM appointments a 
       JOIN patients p ON a.patient_id = p.id 
       WHERE a.doctor_id = ? 
       ORDER BY a.created_at DESC`,
      [doctorId]
    );

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/appointments/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body; // pending, confirmed, cancelled

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const [result] = await pool.query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, appointmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, message: 'Appointment status updated' });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
