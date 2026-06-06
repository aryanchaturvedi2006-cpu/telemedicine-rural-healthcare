import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

const DoctorDashboard = () => {
  const { t, setLanguage } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const doctorData = JSON.parse(localStorage.getItem('tele_user') || '{}');
  const doctorId = doctorData.id;
  const doctorName = doctorData.name || 'Doctor';

  const [appointments, setAppointments] = useState([]);
  const [apptLoading, setApptLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(
    doctorData.is_available !== undefined ? Boolean(doctorData.is_available) : true
  );
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [availabilityMsg, setAvailabilityMsg] = useState('');

  const handleLogout = () => {
    logout();
    localStorage.clear();
    setLanguage('');
    navigate('/');
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId) { setApptLoading(false); return; }
      try {
        const res = await fetch(`${API_BASE_URL}/api/appointments/doctor/${doctorId}`);
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
  }, [doctorId]);

  const handleToggleAvailability = async () => {
    if (!doctorId) return;
    setTogglingAvailability(true);
    setAvailabilityMsg('');
    const newValue = !isAvailable;
    try {
      const res = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: newValue }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAvailable(newValue);
        // Update cached doctor data
        const updated = { ...doctorData, is_available: newValue };
        localStorage.setItem('currentPatient', JSON.stringify(updated));
        setAvailabilityMsg(newValue ? 'You are now available.' : 'You are now unavailable.');
      } else {
        setAvailabilityMsg(data.message || 'Failed to update availability.');
      }
    } catch (err) {
      console.error('Error updating availability:', err);
      setAvailabilityMsg('An error occurred. Please try again.');
    } finally {
      setTogglingAvailability(false);
    }
  };

  const pendingAppts = appointments.filter(a => a.status === 'pending');
  const confirmedAppts = appointments.filter(a => a.status === 'confirmed');

  const statusColor = (status) => {
    if (status === 'confirmed') return '#16a34a';
    if (status === 'cancelled') return '#dc2626';
    return '#d97706';
  };

  return (
    <div className="dashboard-container doctor-theme">
      <header className="dash-header">
        <div className="header-info">
          <h1>{t('hello')}, Dr. {doctorName}</h1>
          <p>{t('doctorPanel')}</p>
        </div>
        <button className="btn-secondary small" onClick={handleLogout}>
          {t('logout')}
        </button>
      </header>

      <div className="dash-body">

        {/* Availability Toggle */}
        <div className="card" style={{ marginBottom: '20px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, marginBottom: '4px' }}>{t('availability')}</h3>
            <p style={{ margin: 0, color: isAvailable ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
              {isAvailable ? 'Available for consultations' : 'Not available'}
            </p>
            {availabilityMsg && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>{availabilityMsg}</p>}
          </div>
          <button
            onClick={handleToggleAvailability}
            disabled={togglingAvailability}
            style={{
              padding: '10px 20px',
              background: isAvailable ? '#dc2626' : '#16a34a',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              opacity: togglingAvailability ? 0.7 : 1,
            }}
          >
            {togglingAvailability ? 'Updating...' : isAvailable ? 'Set Unavailable' : 'Set Available'}
          </button>
        </div>

        {/* Pending Requests */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '12px' }}>
            {t('newRequests')}
            {pendingAppts.length > 0 && (
              <span style={{ marginLeft: '8px', background: '#dc2626', color: '#fff', borderRadius: '12px', padding: '2px 10px', fontSize: '14px' }}>
                {pendingAppts.length}
              </span>
            )}
          </h2>
          {apptLoading ? (
            <p>Loading...</p>
          ) : pendingAppts.length > 0 ? (
            pendingAppts.map((appt) => (
              <div key={appt.id} className="card" style={{ marginBottom: '12px', padding: '16px', borderLeft: '4px solid #d97706' }}>
                <p><strong>Patient:</strong> {appt.patient_name}</p>
                <p><strong>Age / Gender:</strong> {appt.age} / {appt.gender}</p>
                <p><strong>Mobile:</strong> {appt.mobile}</p>
                <p><strong>Date:</strong> {appt.date} at {appt.time}</p>
                <p><strong>Mode:</strong> {appt.mode}</p>
                <p><strong>Symptoms:</strong> {appt.symptoms}</p>
              </div>
            ))
          ) : (
            <p style={{ color: '#6b7280' }}>{t('noRequests')}</p>
          )}
        </div>

        {/* All Appointments */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '12px' }}>{t('todayAppt')}</h2>
          {apptLoading ? (
            <p>Loading...</p>
          ) : confirmedAppts.length > 0 ? (
            confirmedAppts.map((appt) => (
              <div key={appt.id} className="card" style={{ marginBottom: '12px', padding: '16px', borderLeft: '4px solid #16a34a' }}>
                <p><strong>Patient:</strong> {appt.patient_name}</p>
                <p><strong>Date:</strong> {appt.date} at {appt.time}</p>
                <p><strong>Mode:</strong> {appt.mode}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span style={{ color: statusColor(appt.status), fontWeight: 600, textTransform: 'capitalize' }}>
                    {appt.status}
                  </span>
                </p>
              </div>
            ))
          ) : (
            <p style={{ color: '#6b7280' }}>{t('noConsult')}</p>
          )}
        </div>

        <div className="action-grid">
          <div className="card small-card" onClick={() => alert(t('comingSoon'))}>
            <h3>{t('myPatients')}</h3>
            <p>{t('noPatients')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
