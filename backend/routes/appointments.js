const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/appointments/book
router.post('/book', async (req, res) => {
  try {
    const { patient_id, doctor_id, date, time, mode, symptoms, symptom_audio, injury_photo } = req.body;

    if (!patient_id || !doctor_id || !date || !time || !mode || (!symptoms && !symptom_audio)) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const [result] = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, date, time, mode, symptoms, symptom_audio, injury_photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id, date, time, mode, symptoms || null, symptom_audio || null, injury_photo || null]
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
    console.log(`[API] Fetching appointments for doctorId: ${doctorId} (type: ${typeof doctorId})`);

    const sql = `SELECT a.*, COALESCE(p.name, 'Unknown Patient') as patient_name, p.age, p.gender, p.mobile 
       FROM appointments a 
       LEFT JOIN patients p ON a.patient_id = p.id 
       WHERE a.doctor_id = ? 
       ORDER BY a.created_at DESC`;
    
    console.log(`[API] Query: ${sql}`);

    const [appointments] = await pool.query(sql, [doctorId]);
    console.log(`[API] Found ${appointments.length} appointments`);

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
    const { status, scheduled_time } = req.body; // pending, confirmed, cancelled

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let result;
    if (status === 'confirmed' && scheduled_time) {
      [result] = await pool.query(
        'UPDATE appointments SET status = ?, scheduled_time = ? WHERE id = ?',
        [status, scheduled_time, appointmentId]
      );
    } else {
      [result] = await pool.query(
        'UPDATE appointments SET status = ? WHERE id = ?',
        [status, appointmentId]
      );
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, message: 'Appointment status updated' });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/appointments/:id/start-call
router.patch('/:id/start-call', async (req, res) => {
  try {
    await pool.query('UPDATE appointments SET call_started = TRUE WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error starting call:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
