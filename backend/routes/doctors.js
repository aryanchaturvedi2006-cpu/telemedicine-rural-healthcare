const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to calculate distance in km using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
};

router.get('/nearby', async (req, res) => {
  try {
    const { state, patientLat, patientLng } = req.query;
    if (!state) {
      return res.status(400).json({ success: false, message: 'State query parameter is required' });
    }
    let [doctors] = await pool.query(
      'SELECT id, name, specialization, hospital_name, area, is_available, latitude, longitude FROM doctors WHERE state = ?',
      [state]
    );

    if (patientLat && patientLng) {
      const pLat = parseFloat(patientLat);
      const pLng = parseFloat(patientLng);
      
      doctors = doctors.map(doc => {
        if (doc.latitude && doc.longitude) {
          doc.distance = parseFloat(calculateDistance(pLat, pLng, doc.latitude, doc.longitude).toFixed(1));
        }
        return doc;
      });

      doctors.sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        } else if (a.distance !== undefined) {
          return -1;
        } else if (b.distance !== undefined) {
          return 1;
        }
        return 0;
      });
    }

    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error('Error fetching nearby doctors:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/optimal', async (req, res) => {
  try {
    const { specialization } = req.query;
    
    let query = `
      SELECT d.id, d.name, d.specialization, d.hospital_name,
             COUNT(a.id) as pending_count
      FROM doctors d
      LEFT JOIN appointments a ON d.id = a.doctor_id AND a.status = 'pending'
      WHERE d.is_available = 1
    `;
    let queryParams = [];

    if (specialization) {
      query += ` AND d.specialization LIKE ?`;
      queryParams.push(`%${specialization}%`);
    }

    query += `
      GROUP BY d.id
      ORDER BY pending_count ASC
      LIMIT 1
    `;

    const [doctors] = await pool.query(query, queryParams);

    if (doctors.length === 0) {
      // Fallback: If no specialist found, just find the doctor with lowest queue overall
      const [anyDoctor] = await pool.query(`
        SELECT d.id, d.name, d.specialization, d.hospital_name,
               COUNT(a.id) as pending_count
        FROM doctors d
        LEFT JOIN appointments a ON d.id = a.doctor_id AND a.status = 'pending'
        WHERE d.is_available = 1
        GROUP BY d.id
        ORDER BY pending_count ASC
        LIMIT 1
      `);
      if (anyDoctor.length === 0) {
        return res.status(404).json({ success: false, message: 'No available doctors found' });
      }
      return res.status(200).json({ success: true, data: anyDoctor[0], fallback: true });
    }

    res.status(200).json({ success: true, data: doctors[0], fallback: false });
  } catch (error) {
    console.error('Error fetching optimal doctor:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, specialization, hospital_name, area, state, password } = req.body;

    if (!name || !email || !mobile || !specialization || !hospital_name || !area || !state || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

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
    console.error('Error registering doctor:', error.message, error.code);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const [doctors] = await pool.query('SELECT * FROM doctors WHERE email = ?', [email]);
    if (doctors.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid credentials' });
    }

    const doctor = doctors[0];
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    delete doctor.password;
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    console.error('Error logging in doctor:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

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

router.patch('/:id/location', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'latitude and longitude are required' });
    }

    const [result] = await pool.query(
      'UPDATE doctors SET latitude = ?, longitude = ? WHERE id = ?',
      [latitude, longitude, doctorId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({ success: true, message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const [doctors] = await pool.query('SELECT id FROM doctors WHERE email = ?', [email]);
    if (doctors.length === 0) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    const tempPassword = crypto.randomBytes(4).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedTemp = await bcrypt.hash(tempPassword, salt);

    await pool.query('UPDATE doctors SET password = ? WHERE email = ?', [hashedTemp, email]);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'TeleMed Rural - Password Reset',
      html: `<p>Your new temporary password is: <strong>${tempPassword}</strong></p><p>Please login and change it immediately from your profile.</p>`,
    });

    res.status(200).json({ success: true, message: 'New password sent to your email' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ success: false, message: 'Server error. Could not send email.' });
  }
});

router.patch('/:id/change-password', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const [doctors] = await pool.query('SELECT password FROM doctors WHERE id = ?', [doctorId]);
    if (doctors.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, doctors[0].password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNew = await bcrypt.hash(newPassword, salt);
    await pool.query('UPDATE doctors SET password = ? WHERE id = ?', [hashedNew, doctorId]);

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;