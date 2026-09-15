import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VideoCallRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth() || {};

  let displayName = 'Participant';
  try {
    if (user && (user.name || user.full_name || user.username)) {
      displayName = user.name || user.full_name || user.username;
    } else {
      const curPatient = JSON.parse(localStorage.getItem('currentPatient') || '{}');
      const curDoctor = JSON.parse(localStorage.getItem('currentDoctor') || '{}');
      const teleUser = JSON.parse(localStorage.getItem('tele_user') || sessionStorage.getItem('tele_user') || '{}');
      displayName = curPatient.name || curDoctor.name || teleUser.name || teleUser.full_name || 'Participant';
    }
  } catch (e) {
    displayName = 'Participant';
  }

  useEffect(() => {
    const sanitizedRoomId = (id || 'telemed_consultation').replace(/[^a-zA-Z0-9]/g, '_');
    const roomName = `TelemedicineRuralHealthcare_${sanitizedRoomId}`;
    const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName=%22${encodeURIComponent(displayName)}%22`;
    window.open(jitsiUrl, '_blank', 'noopener,noreferrer');
    const timer = setTimeout(() => navigate(-1), 800);
    return () => clearTimeout(timer);
  }, [id, navigate, displayName]);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      textAlign: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <p style={{ fontSize: '18px', marginBottom: '12px' }}>Opening your consultation room in a new tab...</p>
      <p style={{ fontSize: '14px', color: '#94a3b8' }}>Room ID: {id}</p>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: '20px',
          backgroundColor: '#134f64',
          color: '#ffffff',
          border: 'none',
          padding: '10px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600'
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default VideoCallRoom;
