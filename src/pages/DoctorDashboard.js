import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

const DoctorDashboard = () => {
  const { setLanguage } = useLanguage();
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
    const newValue = !isAvailable;
    try {
      const res = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: newValue }),
      });
      if (res.ok) {
        setIsAvailable(newValue);
        const updated = { ...doctorData, is_available: newValue };
        localStorage.setItem('tele_user', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Error updating availability:', err);
    } finally {
      setTogglingAvailability(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const apptRes = await fetch(`${API_BASE_URL}/api/appointments/doctor/${doctorId}`);
        if (apptRes.ok) {
          const apptData = await apptRes.json();
          setAppointments(apptData.data || []);
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const pendingAppts = appointments.filter(a => a.status === 'pending');
  const confirmedAppts = appointments.filter(a => a.status === 'confirmed');

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#F0F4FF',
    fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif",
    position: 'relative',
    padding: '16px',
    boxSizing: 'border-box',
    color: '#1A1A1A'
  };

  const backBtnStyle = {
    position: 'absolute',
    top: '16px',
    left: '16px',
    background: 'none',
    border: 'none',
    color: '#1565C0',
    fontSize: '15px',
    cursor: 'pointer',
    minHeight: '52px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px'
  };

  const contentStyle = {
    maxWidth: '720px',
    margin: '48px auto 0 auto',
    padding: '0 16px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };

  const cardBaseStyle = {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    boxSizing: 'border-box'
  };

  const headerCardStyle = {
    ...cardBaseStyle,
    padding: '20px 24px',
    borderBottom: '3px solid #1565C0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const availabilityCardStyle = {
    ...cardBaseStyle,
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const emptyStateStyle = {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    textAlign: 'center',
    border: '1.5px dashed #E0E0E0',
    boxSizing: 'border-box'
  };

  const sectionHeadingStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
    marginTop: '0'
  };

  const getModeIcon = (mode) => {
    if (mode === 'video') return '📹';
    if (mode === 'audio') return '📞';
    return '💬';
  };

  const getStatusBadgeStyle = (status) => {
    const base = { borderRadius: '20px', padding: '4px 12px', fontSize: '12px', display: 'inline-block', fontWeight: 'bold', textTransform: 'capitalize' };
    if (status === 'confirmed') return { ...base, backgroundColor: '#E8F5E9', color: '#2E7D32' };
    if (status === 'cancelled') return { ...base, backgroundColor: '#FFEBEE', color: '#C62828' };
    return { ...base, backgroundColor: '#FFF8E1', color: '#F57F17' }; // pending
  };

  return (
    <div style={containerStyle}>
      <button 
        style={backBtnStyle} 
        onClick={() => navigate(-1)}
        onMouseOver={(e) => e.target.style.color = '#0D47A1'}
        onMouseOut={(e) => e.target.style.color = '#1565C0'}
      >
        ← Back
      </button>

      <div style={contentStyle}>
        
        {/* Header Card */}
        <div style={headerCardStyle}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#1A1A1A' }}>
              Hello, Dr. {doctorName} 👨‍⚕️
            </h1>
            <p style={{ fontSize: '14px', color: '#555', margin: 0 }}>Doctor Panel</p>
          </div>
          <button 
            style={{
              border: '1.5px solid #1565C0', color: '#1565C0', backgroundColor: '#fff',
              borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: 'bold',
              cursor: 'pointer', transition: 'all 0.2s', minHeight: '52px'
            }}
            onClick={handleLogout}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#1565C0'; e.target.style.color = '#fff'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#1565C0'; }}
          >
            Logout
          </button>
        </div>

        {/* Availability Card */}
        <div style={availabilityCardStyle}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>🟢 Availability</div>
            {isAvailable ? (
              <div style={{ color: '#2E7D32', fontSize: '14px', fontWeight: 'bold' }}>Available for consultations</div>
            ) : (
              <div style={{ color: '#C62828', fontSize: '14px', fontWeight: 'bold' }}>Currently unavailable</div>
            )}
          </div>
          <button
            onClick={handleToggleAvailability}
            disabled={togglingAvailability}
            style={{
              backgroundColor: isAvailable ? '#C62828' : '#2E7D32',
              color: '#fff', borderRadius: '8px', padding: '10px 20px',
              fontSize: '14px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
              opacity: togglingAvailability ? 0.7 : 1, minHeight: '52px'
            }}
            onMouseOver={(e) => { if (!togglingAvailability) e.target.style.backgroundColor = isAvailable ? '#B71C1C' : '#1B5E20'; }}
            onMouseOut={(e) => { if (!togglingAvailability) e.target.style.backgroundColor = isAvailable ? '#C62828' : '#2E7D32'; }}
          >
            {isAvailable ? 'Set Unavailable' : 'Set Available'}
          </button>
        </div>

        {/* New Patient Requests Section */}
        <div>
          <h2 style={sectionHeadingStyle}>🔔 New Patient Requests</h2>
          {apptLoading ? (
            <p>Loading...</p>
          ) : pendingAppts.length > 0 ? (
            pendingAppts.map((appt) => (
              <div key={appt.id} style={{ ...cardBaseStyle, marginBottom: '16px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '15px' }}><strong>Patient:</strong> {appt.patient_name}</p>
                <p style={{ margin: '0 0 8px 0', fontSize: '15px' }}><strong>Age / Gender:</strong> {appt.age} / {appt.gender}</p>
                <p style={{ margin: '0 0 8px 0', fontSize: '15px' }}><strong>Mobile:</strong> {appt.mobile}</p>
                <p style={{ margin: '0 0 8px 0', fontSize: '15px' }}><strong>Date:</strong> {appt.date} at {appt.time}</p>
                <p style={{ margin: '0 0 8px 0', fontSize: '15px' }}><strong>Mode:</strong> {appt.mode}</p>
                <p style={{ margin: '0 0 16px 0', fontSize: '15px' }}><strong>Symptoms:</strong> {appt.symptoms}</p>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => handleStatusUpdate(appt.id, 'confirmed')}
                    style={{ flex: 1, height: '52px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Accept
                  </button>
                  <button onClick={() => handleStatusUpdate(appt.id, 'cancelled')}
                    style={{ flex: 1, height: '52px', backgroundColor: '#C62828', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1A1A1A' }}>No new requests</div>
              <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>New patient requests will appear here</div>
            </div>
          )}
        </div>

        {/* Today's Appointments Section */}
        <div>
          <h2 style={sectionHeadingStyle}>📅 Today's Appointments</h2>
          {apptLoading ? (
            <p>Loading...</p>
          ) : confirmedAppts.length > 0 ? (
            confirmedAppts.map((appt) => (
              <div key={appt.id} style={{ ...cardBaseStyle, padding: '20px 24px', borderLeft: '4px solid #1565C0', marginBottom: '16px' }}>
                <div style={{ fontSize: '15px', marginBottom: '8px' }}><strong>👤 Patient:</strong> {appt.patient_name}</div>
                <div style={{ fontSize: '15px', marginBottom: '8px' }}><strong>📅 Date:</strong> {appt.date}</div>
                <div style={{ fontSize: '15px', marginBottom: '12px' }}><strong>{getModeIcon(appt.mode)} Mode:</strong> {appt.mode}</div>
                <div><span style={getStatusBadgeStyle(appt.status)}>{appt.status}</span></div>
              </div>
            ))
          ) : (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📆</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1A1A1A' }}>No appointments today</div>
              <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>Your schedule is clear</div>
            </div>
          )}
        </div>

        {/* My Patients Section */}
        <div>
          <h2 style={sectionHeadingStyle}>👥 My Patients</h2>
          <div style={{ ...emptyStateStyle, width: '100%' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👤</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1A1A1A' }}>No patients yet</div>
            <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>Patients you consult will appear here</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;
