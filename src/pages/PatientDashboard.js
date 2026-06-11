import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';
import './TeleMedGlobal.css';

const PatientDashboard = () => {
  const { t, setLanguage } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Read from local storage fallback
  const localPatient = JSON.parse(localStorage.getItem('patientData') || '{}');
  const sessionPatient = JSON.parse(localStorage.getItem('currentPatient') || '{}');
  
  // Prefer sessionPatient, fallback to localPatient
  const patientData = sessionPatient.name ? sessionPatient : localPatient;
  const name = patientData.name || 'Patient';
  const patientId = patientData.id;

  const handleLogout = () => {
    logout();
    localStorage.clear();
    setLanguage('');
    navigate('/');
  };

  // Nearby doctors
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  // Appointments
  const [appointments, setAppointments] = useState([]);
  const [apptLoading, setApptLoading] = useState(true);

  // Booking modal
  const [showModal, setShowModal] = useState(false);
  const [bookForm, setBookForm] = useState({
    doctor_id: '',
    date: '',
    time: '',
    mode: 'video',
    symptoms: '',
  });
  const [bookError, setBookError] = useState('');
  const [bookSuccess, setBookSuccess] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const state = patientData.state || '';
        if (!state) { setDoctorsLoading(false); return; }
        const res = await fetch(`${API_BASE_URL}/api/doctors/nearby?state=${encodeURIComponent(state)}`);
        if (res.ok) {
          const data = await res.json();
          setDoctors(data.data || []);
        } else {
          setDoctors([]);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setDoctors([]);
      } finally {
        setDoctorsLoading(false);
      }
    };
    fetchDoctors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientData.state]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientId || patientId === 'local-temp-id') { setApptLoading(false); return; }
      try {
        const res = await fetch(`${API_BASE_URL}/api/appointments/patient/${patientId}`);
        if (res.ok) {
          const data = await res.json();
          setAppointments(data.data || []);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setAppointments([]);
      } finally {
        setApptLoading(false);
      }
    };
    fetchAppointments();
  }, [patientId]);

  const handleBookChange = (e) => {
    setBookForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setBookError('');
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setBookError('');
    setBookSuccess('');

    if (!bookForm.doctor_id || !bookForm.date || !bookForm.time || !bookForm.symptoms) {
      setBookError('Please fill in all fields.');
      return;
    }

    setBooking(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          doctor_id: bookForm.doctor_id,
          date: bookForm.date,
          time: bookForm.time,
          mode: bookForm.mode,
          symptoms: bookForm.symptoms,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookSuccess('Appointment booked successfully!');
        setBookForm({ doctor_id: '', date: '', time: '', mode: 'video', symptoms: '' });
        const apptRes = await fetch(`${API_BASE_URL}/api/appointments/patient/${patientId}`);
        if (apptRes.ok) {
          const apptData = await apptRes.json();
          setAppointments(apptData.data || []);
        }
      } else {
        setBookError(data.message || 'Booking failed. Please try again.');
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      setBookError('An error occurred. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const modalOverlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  };
  const modalStyle = {
    background: '#fff', borderRadius: '16px', padding: '24px', width: '100%',
    maxWidth: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  };
  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1.5px solid #E0E0E0',
    borderRadius: '10px', fontSize: '15px', marginTop: '4px', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: '13px', fontWeight: 600, color: '#555', display: 'block' };

  return (
    <div className="tm-page-container">
      <button className="tm-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="tm-dashboard-content">
        <div className="tm-card tm-header-card">
          <div className="tm-header-info">
            <h1 className="tm-greeting">Hello, {name} 👋</h1>
            <p className="tm-header-sub">Your Health Centre</p>
          </div>
          <button className="tm-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="tm-book-consultation-card" onClick={() => { setShowModal(true); setBookError(''); setBookSuccess(''); }}>
          <h2 className="tm-book-title">🩺 Book a Consultation</h2>
          <p className="tm-book-sub">Talk to a verified doctor now</p>
          <div className="tm-book-arrow">→</div>
        </div>

        <div className="tm-section">
          <h2 className="tm-section-heading">📅 Upcoming Consultations</h2>
          {apptLoading ? (
            <p>Loading...</p>
          ) : appointments.length > 0 ? (
            appointments.map((appt) => (
              <div key={appt.id} className="tm-card tm-appt-card">
                <p><strong>Doctor:</strong> {appt.doctor_name} ({appt.specialization})</p>
                <p><strong>Hospital:</strong> {appt.hospital_name}</p>
                <p><strong>Date:</strong> {appt.date} at {appt.time}</p>
                <p><strong>Mode:</strong> {appt.mode}</p>
                <p><strong>Symptoms:</strong> {appt.symptoms}</p>
                <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{appt.status}</span></p>
              </div>
            ))
          ) : (
            <div className="tm-empty-state">
              <div className="tm-empty-icon">📋</div>
              <div className="tm-empty-text">No consultations yet</div>
              <div className="tm-empty-sub">Book your first consultation above</div>
            </div>
          )}
        </div>

        <div className="tm-section">
          <h2 className="tm-section-heading">📍 Nearby Doctors</h2>
          {doctorsLoading ? (
            <p>Loading...</p>
          ) : doctors.length > 0 ? (
            doctors.map((doc) => (
              <div key={doc.id} className="tm-card tm-doctor-card">
                <div className="tm-doc-info">
                  <h3>{doc.name}</h3>
                  <p><strong>{t('specialization')}:</strong> {doc.specialization}</p>
                  <p><strong>{t('hospital')}:</strong> {doc.hospital_name}</p>
                </div>
                <button
                  className="tm-btn-primary"
                  onClick={() => { setShowModal(true); setBookForm(prev => ({ ...prev, doctor_id: doc.id })); }}
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  {t('requestConsult')}
                </button>
              </div>
            ))
          ) : (
            <div className="tm-empty-state">
              <div className="tm-empty-icon">🏥</div>
              <div className="tm-empty-text">No doctors found nearby</div>
              <div className="tm-empty-sub">We're adding more doctors in your area</div>
            </div>
          )}
        </div>

        <div className="tm-card tm-records-card" onClick={() => alert('Feature coming soon!')} style={{ cursor: 'pointer' }}>
          <div className="tm-records-left">
            <div className="tm-records-icon">📁</div>
            <h2 className="tm-records-title">My Health Records</h2>
            <div className="tm-badge-coming-soon">Coming Soon</div>
          </div>
          <p className="tm-records-sub" style={{ marginTop: '8px' }}>Your prescriptions and test reports will appear here</p>
        </div>
      </div>

      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>{t('bookConsult')}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>
            {bookError && <p style={{ color: 'red', marginBottom: '12px', fontSize: '14px' }}>{bookError}</p>}
            {bookSuccess && <p style={{ color: 'green', marginBottom: '12px', fontSize: '14px' }}>{bookSuccess}</p>}
            <form onSubmit={handleBookSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Doctor</label>
                <select name="doctor_id" value={bookForm.doctor_id} onChange={handleBookChange} style={inputStyle} required>
                  <option value="">Select a doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name} — {doc.specialization}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Date</label>
                <input type="date" name="date" value={bookForm.date} onChange={handleBookChange} style={inputStyle} required />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Time</label>
                <input type="time" name="time" value={bookForm.time} onChange={handleBookChange} style={inputStyle} required />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Mode</label>
                <select name="mode" value={bookForm.mode} onChange={handleBookChange} style={inputStyle}>
                  <option value="video">Video Call</option>
                  <option value="audio">Audio Call</option>
                  <option value="in-person">In Person</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Symptoms / Reason</label>
                <textarea name="symptoms" value={bookForm.symptoms} onChange={handleBookChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Describe your symptoms..." required />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={booking} className="tm-btn-primary" style={{ flex: 1 }}>{booking ? 'Booking...' : 'Confirm Booking'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="tm-btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
