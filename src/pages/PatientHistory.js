import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import translations from '../translations/translations';
import { useLanguage } from '../context/LanguageContext';
import API_BASE_URL from '../config';

const PatientHistory = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key) => translations[language]?.[key] || translations['en'][key] || key;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patientDataStr = localStorage.getItem('currentPatient') || localStorage.getItem('patientData');
    const patientData = patientDataStr ? JSON.parse(patientDataStr) : null;
    const patientId = patientData?.id;
    if (!patientId) {
      navigate('/patient-login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL || 'http://localhost:5001'}/api/appointments/patient/${patientId}`);
        if (res.ok) {
          const data = await res.json();
          const sorted = (data.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
          setAppointments(sorted);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <button 
        onClick={() => navigate('/patient-dashboard')}
        style={{ marginBottom: '20px', padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        ← Back
      </button>

      <h1 style={{ color: '#111827', marginBottom: '24px', fontSize: '28px', borderBottom: '2px solid #22c55e', paddingBottom: '12px' }}>
        📋 {t('patientHistory')}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <div style={{ padding: '40px', background: '#f9fafb', borderRadius: '12px', textAlign: 'center', border: '1px dashed #d1d5db' }}>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>{t('noHistory')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {appointments.map((appt) => (
            <div key={appt.id} style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#1f2937' }}>👨‍⚕️ {appt.doctor_name || 'Doctor'}</h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>{appt.specialization} • {appt.hospital_name}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize',
                    background: appt.status === 'completed' ? '#dcfce7' : '#f3f4f6',
                    color: appt.status === 'completed' ? '#166534' : '#374151'
                  }}>
                    {appt.status}
                  </span>
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>
                    {t('dateText')}: {appt.date}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#374151', fontSize: '14px' }}>🤒 {t('symptomsLabel') || 'Symptoms'}:</strong>
                <p style={{ margin: '4px 0 0 0', color: '#4b5563', fontSize: '15px' }}>{appt.symptoms}</p>
              </div>

              {(appt.medicines || appt.prescription_text || appt.prescription_image) && (
                <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  {appt.medicines && (
                    <div style={{ marginBottom: '12px' }}>
                      <strong style={{ color: '#166534', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        💊 {t('medicines')}
                      </strong>
                      <p style={{ margin: '6px 0 0 0', color: '#15803d', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                        {appt.medicines}
                      </p>
                    </div>
                  )}
                  {appt.prescription_text && (
                    <div style={{ marginBottom: appt.prescription_image ? '12px' : '0' }}>
                      <strong style={{ color: '#166534', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📝 {t('doctorNotes')}
                      </strong>
                      <p style={{ margin: '6px 0 0 0', color: '#15803d', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                        {appt.prescription_text}
                      </p>
                    </div>
                  )}
                  {appt.prescription_image && (
                    <div>
                      <strong style={{ color: '#166534', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        📷 Prescription Photo
                      </strong>
                      <img src={appt.prescription_image} alt="Prescription" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid #166534' }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
