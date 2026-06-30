import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

const DoctorDashboard = () => {
  const { t, language, setLanguage } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const doctorData = JSON.parse(localStorage.getItem('tele_user') || '{}');
  const doctorId = doctorData.id;
  const doctorName = doctorData.name || 'Doctor';

  const [appointments, setAppointments] = useState([]);
  const [apptLoading, setApptLoading] = useState(true);
  const [apptError, setApptError] = useState('');
  const [isAvailable, setIsAvailable] = useState(
    doctorData.is_available !== undefined ? Boolean(doctorData.is_available) : true
  );
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [showLocationBanner, setShowLocationBanner] = useState(!doctorData.latitude && localStorage.getItem('hide_location_banner') !== 'true');

  // Change Password modal state
  const [showChangePw, setShowChangePw] = useState(false);
  const [changePwForm, setChangePwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changePwError, setChangePwError] = useState('');
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const LOCATION_BANNER_LABEL = {
    hi: "मरीजों को सटीक दूरी दिखाने के लिए लोकेशन जोड़ें",
    en: "Add location to show patients accurate distance",
    gu: "દર્દીઓને ચોક્કસ અંતર બતાવવા માટે લોકેશન ઉમેરો",
    mr: "रुग्णांना अचूक अंतर दाखवण्यासाठी लोकेशन जोडा",
    ta: "நோயாளிகளுக்கு துல்லியமான தூரத்தைக் காட்ட இருப்பிடத்தைச் சேர்க்கவும்",
    te: "రోగులకు ఖచ్చితమైన దూరం చూపడానికి లొకేషన్ జోడించండి",
    pa: "ਮਰੀਜ਼ਾਂ ਨੂੰ ਸਹੀ ਦੂਰੀ ਦਿਖਾਉਣ ਲਈ ਟਿਕਾਣਾ ਸ਼ਾਮਲ ਕਰੋ",
    bn: "রোগীদের সঠিক দূরত্ব দেখাতে অবস্থান যোগ করুন",
    kn: "ರೋಗಿಗಳಿಗೆ ನಿಖರವಾದ ದೂರವನ್ನು ತೋರಿಸಲು ಸ್ಥಳವನ್ನು ಸೇರಿಸಿ",
    ml: "രോഗികളെ കൃത്യമായ ദൂരം കാണിക്കാൻ ലൊക്കേഷൻ ചേർക്കൂ",
    mw: "मरीजां नै सटीक दूरी दिखावण वास्ते लोकेशन जोड़ो",
    as: "ৰোগীসকলক সঠিক দূৰত্ব দেখুৱাবলৈ অৱস্থান যোগ কৰক",
    or: "ରୋଗୀଙ୍କୁ ସଠିକ୍ ଦୂରତା ଦେଖାଇବା ପାଇଁ ଲୋକେସନ୍ ଯୋଡନ୍ତୁ",
    nm: "Moraa ke thik duri dekhabo laagi location jorok"
  };

  const handleLocationUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/location`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                latitude: position.coords.latitude, 
                longitude: position.coords.longitude 
              }),
            });
            if (res.ok) {
              const updated = { ...doctorData, latitude: position.coords.latitude, longitude: position.coords.longitude };
              localStorage.setItem('tele_user', JSON.stringify(updated));
              setShowLocationBanner(false);
            }
          } catch (e) {
            console.error("Location update failed", e);
          }
        },
        (error) => {
          console.error("Location error:", error);
        }
      );
    }
  };

  const dismissLocationBanner = () => {
    localStorage.setItem('hide_location_banner', 'true');
    setShowLocationBanner(false);
  };

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
          let errorData = {};
          try { errorData = await res.json(); } catch (e) {}
          const errorMsg = errorData.message || `Server returned ${res.status}: ${res.statusText}`;
          console.error('Backend returned error:', errorMsg);
          setAppointments([]);
          setApptError(errorMsg); // Display in UI
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setAppointments([]);
        setApptError(err.message || 'Network error fetching appointments');
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

  const handleStartCall = async (appointmentId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}/start-call`, {
        method: 'PATCH'
      });
      if (res.ok) {
        navigate(`/video-call/appointment-${appointmentId}`);
      } else {
        console.error('Failed to start call');
      }
    } catch (err) {
      console.error('Error starting call:', err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePwError('');
    const { currentPassword, newPassword, confirmPassword } = changePwForm;
    if (newPassword !== confirmPassword) {
      setChangePwError(t ? t('passwordMismatch') || 'Passwords do not match' : 'Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setChangePwError('New password must be at least 6 characters');
      return;
    }
    setChangePwLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/doctors/${doctorData.id}/change-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setShowChangePw(false);
        setChangePwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password changed successfully!');
      } else {
        setChangePwError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setChangePwError('An error occurred. Please try again.');
    } finally {
      setChangePwLoading(false);
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => { setShowChangePw(true); setChangePwError(''); setChangePwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
              style={{
                border: '1.5px solid #1565C0', color: '#1565C0', backgroundColor: '#fff',
                borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 'bold',
                cursor: 'pointer', transition: 'all 0.2s', minHeight: '52px'
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1565C0'; e.currentTarget.style.color = '#fff'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#1565C0'; }}
            >
              {t ? t('changePassword') || 'Change Password' : 'Change Password'}
            </button>
            <button 
              style={{
                border: '1.5px solid #1565C0', color: '#1565C0', backgroundColor: '#fff',
                borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: 'bold',
                cursor: 'pointer', transition: 'all 0.2s', minHeight: '52px'
              }}
              onClick={handleLogout}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1565C0'; e.currentTarget.style.color = '#fff'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#1565C0'; }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Location Banner */}
        {showLocationBanner && (
          <div style={{ ...cardBaseStyle, backgroundColor: '#FFF3E0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #FFE0B2', marginBottom: '-8px' }}>
            <div style={{ fontSize: '14px', color: '#E65100', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📍</span>
              {LOCATION_BANNER_LABEL[language] || LOCATION_BANNER_LABEL.en}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleLocationUpdate}
                style={{ background: '#E65100', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' }}
              >
                Add Location
              </button>
              <button 
                onClick={dismissLocationBanner}
                style={{ background: 'transparent', color: '#E65100', border: 'none', padding: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                title="Dismiss"
              >
                &times;
              </button>
            </div>
          </div>
        )}

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
          {apptError && (
            <div style={{ backgroundColor: '#FFEBEE', borderLeft: '4px solid #C62828', color: '#C62828', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
              <strong>Error loading appointments:</strong> {apptError}
            </div>
          )}
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
                {appt.symptoms && <p style={{ margin: '0 0 16px 0', fontSize: '15px' }}><strong>Symptoms:</strong> {appt.symptoms}</p>}
                {appt.symptom_audio && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '15px' }}><strong>Voice Note:</strong></p>
                    <audio controls src={appt.symptom_audio} style={{ width: '100%', height: '40px' }} />
                  </div>
                )}
                {appt.injury_photo && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '15px' }}><strong>Patient photo:</strong></p>
                    <img src={appt.injury_photo} alt="Patient injury" style={{ maxHeight: '200px', borderRadius: '8px', width: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                
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
                {appt.symptom_audio && (
                  <div style={{ marginBottom: '12px' }}>
                    <audio controls src={appt.symptom_audio} style={{ width: '100%', height: '32px' }} />
                  </div>
                )}
                <div><span style={getStatusBadgeStyle(appt.status)}>{appt.status}</span></div>
                {appt.status === 'confirmed' && (appt.mode === 'Video Call' || appt.mode === 'video') && (
                  <button 
                    onClick={() => handleStartCall(appt.id)}
                    style={{
                      marginTop: '16px', width: '100%', height: '52px', backgroundColor: '#1565C0', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
                    }}
                  >
                    {t ? t('startVideoCall') || 'Start Video Call' : 'Start Video Call'}
                  </button>
                )}
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

      {/* Change Password Modal */}
      {showChangePw && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1565C0' }}>
                {t ? t('changePassword') || 'Change Password' : 'Change Password'}
              </h2>
              <button onClick={() => setShowChangePw(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>

            {changePwError && (
              <div style={{ backgroundColor: '#FFEBEE', borderLeft: '4px solid #C62828', color: '#C62828', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
                {changePwError}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              {[{ label: t ? t('currentPassword') || 'Current Password' : 'Current Password', field: 'currentPassword', show: showCurrent, toggle: () => setShowCurrent(v => !v) },
                { label: t ? t('newPassword') || 'New Password' : 'New Password', field: 'newPassword', show: showNew, toggle: () => setShowNew(v => !v) },
                { label: t ? t('confirmNewPassword') || 'Confirm New Password' : 'Confirm New Password', field: 'confirmPassword', show: showConfirm, toggle: () => setShowConfirm(v => !v) }]
                .map(({ label, field, show, toggle }) => (
                  <div key={field} style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#333', marginBottom: '6px' }}>{label}</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={show ? 'text' : 'password'}
                        value={changePwForm[field]}
                        onChange={(e) => setChangePwForm(prev => ({ ...prev, [field]: e.target.value }))}
                        required
                        style={{ width: '100%', height: '48px', borderRadius: '10px', border: '1.5px solid #E0E0E0', padding: '12px 44px 12px 16px', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
                        onFocus={(e) => e.target.style.borderColor = '#1565C0'}
                        onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                      />
                      <button type="button" onClick={toggle} tabIndex={-1} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px', lineHeight: 1 }}>
                        {show ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                ))}

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" disabled={changePwLoading} style={{ flex: 1, height: '52px', backgroundColor: '#1565C0', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', opacity: changePwLoading ? 0.7 : 1 }}>
                  {changePwLoading ? 'Saving...' : (t ? t('changePassword') || 'Change Password' : 'Change Password')}
                </button>
                <button type="button" onClick={() => setShowChangePw(false)} style={{ flex: 1, height: '52px', backgroundColor: '#fff', color: '#6b7280', border: '1.5px solid #E0E0E0', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
