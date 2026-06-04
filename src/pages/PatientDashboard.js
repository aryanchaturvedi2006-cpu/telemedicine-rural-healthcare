import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

const PatientDashboard = () => {
  const { t, setLanguage } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const patientData = JSON.parse(localStorage.getItem('currentPatient') || '{}');
  const name = patientData.name || 'Patient';

  const handleLogout = () => {
    logout();
    localStorage.clear();
    setLanguage('');
    navigate('/');
  };

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const state = patientData.state || '';
        if (!state) {
          setLoading(false);
          return;
        }
        const response = await fetch(`${API_BASE_URL}/api/doctors/nearby?state=${state}`);
        if (response.ok) {
          const data = await response.json();
          setDoctors(data.doctors);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [patientData.state]);

  return (
    <div className="dashboard-container patient-theme">
      <header className="dash-header">
        <div className="header-info">
          <h1>{t('hello')}, {name}</h1>
          <p>{t('healthCenter')}</p>
        </div>
        <button className="btn-secondary small" onClick={handleLogout}>
          {t('logout')}
        </button>
      </header>

      <div className="dash-body">
        
        {/* First section: Aapke Paas Ke Doctors */}
        <div className="nearby-doctors mb-4" style={{ marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '4px' }}>{t('nearbyDoctors')}</h2>
          <p style={{ marginBottom: '16px' }}>{t('nearbyDoctorsSub')}</p>

          {loading ? (
            <p>Loading...</p>
          ) : doctors.length > 0 ? (
            doctors.map((doc) => (
              <div key={doc.id} className="card doctor-card">
                <div className="doc-info">
                  <h3>{doc.name}</h3>
                  <p><strong>{t('specialization')}:</strong> {doc.specialization}</p>
                  <p><strong>{t('hospital')}:</strong> {doc.hospital}</p>
                  <p><strong>{t('distance')}:</strong> Nearby</p>
                </div>
                <button 
                  className="btn-primary large mt-4" 
                  style={{ backgroundColor: 'var(--primary-green)' }}
                  onClick={() => alert(t('requestSent'))}
                >
                  {t('requestConsult')}
                </button>
              </div>
            ))
          ) : (
            <p>{t('noDoctorsFound')}</p>
          )}
        </div>

        {/* Existing features below */}
        <div className="card hero-card" onClick={() => alert(t('comingSoon'))}>
          <h2>{t('bookConsult')}</h2>
          <p>{t('bookConsultSub')}</p>
        </div>

        <div className="action-grid mt-4" style={{ marginTop: '16px' }}>
          <div className="card small-card" onClick={() => alert(t('comingSoon'))}>
            <h3>{t('upcomingConsult')}</h3>
            <p>{t('noConsult')}</p>
          </div>

          <div className="card small-card" onClick={() => alert(t('comingSoon'))}>
            <h3>{t('myRecords')}</h3>
            <p>{t('comingSoon')}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
