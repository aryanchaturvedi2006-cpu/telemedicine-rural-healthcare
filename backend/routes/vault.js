const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/health-vault');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// ==========================================
// DOCUMENTS
// ==========================================

// Upload a document
router.post('/:patientId/documents', upload.single('file'), async (req, res) => {
  try {
    const { patientId } = req.params;
    const { name, category } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // path relative to backend root to be served statically
    const filePath = `/uploads/health-vault/${file.filename}`;
    
    const query = `
      INSERT INTO documents (patient_id, name, category, file_path, file_type, file_size)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await pool.query(query, [
      patientId, 
      name || file.originalname, 
      category || 'Other Document', 
      filePath, 
      file.mimetype, 
      file.size
    ]);

    res.json({ success: true, message: 'Document uploaded', data: { id: result[0].insertId, filePath } });
  } catch (err) {
    console.error('Error uploading document:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all documents for a patient
router.get('/:patientId/documents', async (req, res) => {
  try {
    const { patientId } = req.params;
    const query = `SELECT * FROM documents WHERE patient_id = ? ORDER BY upload_date DESC`;
    const [documents] = await pool.query(query, [patientId]);
    res.json({ success: true, data: documents });
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete a document
router.delete('/:patientId/documents/:docId', async (req, res) => {
  try {
    const { patientId, docId } = req.params;
    
    // Get file path to delete from disk
    const [docs] = await pool.query(`SELECT file_path FROM documents WHERE id = ? AND patient_id = ?`, [docId, patientId]);
    if (docs.length > 0) {
      const filePath = path.join(__dirname, '..', docs[0].file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const query = `DELETE FROM documents WHERE id = ? AND patient_id = ?`;
    await pool.query(query, [docId, patientId]);
    res.json({ success: true, message: 'Document deleted' });
  } catch (err) {
    console.error('Error deleting document:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==========================================
// EMERGENCY PROFILE
// ==========================================

// Get emergency profile
router.get('/:patientId/emergency_profile', async (req, res) => {
  try {
    const { patientId } = req.params;
    const [profiles] = await pool.query(`SELECT * FROM emergency_profiles WHERE patient_id = ?`, [patientId]);
    if (profiles.length > 0) {
      res.json({ success: true, data: profiles[0] });
    } else {
      res.json({ success: true, data: null });
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update/Create emergency profile
router.put('/:patientId/emergency_profile', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { blood_group, allergies, emergency_contact, chronic_diseases, current_medicines } = req.body;

    const [existing] = await pool.query(`SELECT * FROM emergency_profiles WHERE patient_id = ?`, [patientId]);
    
    if (existing.length > 0) {
      await pool.query(`
        UPDATE emergency_profiles 
        SET blood_group=?, allergies=?, emergency_contact=?, chronic_diseases=?, current_medicines=? 
        WHERE patient_id=?
      `, [blood_group, allergies, emergency_contact, chronic_diseases, current_medicines, patientId]);
    } else {
      await pool.query(`
        INSERT INTO emergency_profiles (patient_id, blood_group, allergies, emergency_contact, chronic_diseases, current_medicines)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [patientId, blood_group, allergies, emergency_contact, chronic_diseases, current_medicines]);
    }
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==========================================
// VACCINATIONS
// ==========================================

// Get vaccinations
router.get('/:patientId/vaccinations', async (req, res) => {
  try {
    const { patientId } = req.params;
    const [vaccinations] = await pool.query(`SELECT * FROM vaccinations WHERE patient_id = ? ORDER BY date DESC`, [patientId]);
    res.json({ success: true, data: vaccinations });
  } catch (err) {
    console.error('Error fetching vaccinations:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add vaccination
router.post('/:patientId/vaccinations', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { name, date, dose } = req.body;
    await pool.query(`
      INSERT INTO vaccinations (patient_id, name, date, dose)
      VALUES (?, ?, ?, ?)
    `, [patientId, name, date, dose]);
    res.json({ success: true, message: 'Vaccination added' });
  } catch (err) {
    console.error('Error adding vaccination:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete vaccination
router.delete('/:patientId/vaccinations/:id', async (req, res) => {
  try {
    const { patientId, id } = req.params;
    await pool.query(`DELETE FROM vaccinations WHERE id = ? AND patient_id = ?`, [id, patientId]);
    res.json({ success: true, message: 'Vaccination deleted' });
  } catch (err) {
    console.error('Error deleting vaccination:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
