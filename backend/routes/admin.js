const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/admin/analytics
router.get('/analytics', async (req, res) => {
  try {
    // 1. Total Counts
    const [patientResult] = await pool.query('SELECT COUNT(*) as count FROM patients');
    const [doctorResult] = await pool.query('SELECT COUNT(*) as count FROM doctors');
    const [apptResult] = await pool.query('SELECT COUNT(*) as count FROM appointments');

    // 2. Appointments by Status
    const [statusResult] = await pool.query('SELECT status, COUNT(*) as count FROM appointments GROUP BY status');

    // 3. Gender Distribution
    const [genderResult] = await pool.query('SELECT gender, COUNT(*) as count FROM patients WHERE gender IS NOT NULL GROUP BY gender');

    // 4. State/Location Distribution
    const [stateResult] = await pool.query('SELECT state, COUNT(*) as count FROM patients WHERE state IS NOT NULL GROUP BY state');

    // 5. Disease/Symptoms Trends
    // We will extract the disease from symptoms (e.g., "Malaria - fever, chills" -> "Malaria")
    const [symptomsResult] = await pool.query('SELECT symptoms FROM appointments WHERE symptoms IS NOT NULL AND symptoms != ""');
    
    const diseaseCounts = {};
    symptomsResult.forEach(row => {
      if (row.symptoms) {
        // Extract the disease name which is before the '-' or ' - '
        const diseaseName = row.symptoms.split('-')[0].trim();
        diseaseCounts[diseaseName] = (diseaseCounts[diseaseName] || 0) + 1;
      }
    });

    // Convert diseaseCounts to array format
    const diseaseDistribution = Object.keys(diseaseCounts).map(key => ({
      name: key,
      count: diseaseCounts[key]
    })).sort((a, b) => b.count - a.count); // sort descending

    res.status(200).json({
      success: true,
      data: {
        totals: {
          patients: patientResult[0]?.count || 0,
          doctors: doctorResult[0]?.count || 0,
          appointments: apptResult[0]?.count || 0
        },
        appointmentStatus: statusResult,
        genderDistribution: genderResult,
        stateDistribution: stateResult,
        diseaseDistribution: diseaseDistribution
      }
    });

  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
