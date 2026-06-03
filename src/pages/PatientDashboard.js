import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PatientDashboard = () => {
  const { t, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const patientData = JSON.parse(localStorage.getItem('patientData') || '{}');
  const name = patientData.fullName || 'Ramesh';

  const handleLogout = () => {
    localStorage.removeItem('patientData');
    setLanguage('');
    navigate('/');
  };

  const dummyDoctors = [
    { id: 1, name: "Dr. Sharma", specKey: "General Medicine", hospital: "District Hospital", dist: "2 km" },
    { id: 2, name: "Dr. Verma", specKey: "Paediatrics (Children)", hospital: "City Clinic", dist: "5 km" },
    { id: 3, name: "Dr. Patel", specKey: "Orthopaedics (Bones)", hospital: "Sanjeevani Hospital", dist: "12 km" }
  ];

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
        <div className="card hero-card" onClick={() => alert(t('comingSoon'))}>
          <h2>{t('bookConsult')}</h2>
          <p>{t('bookConsultSub')}</p>
        </div>

        <div className="action-grid">
          <div className="card small-card" onClick={() => alert(t('comingSoon'))}>
            <h3>{t('upcomingConsult')}</h3>
            <p>{t('noConsult')}</p>
          </div>

          <div className="card small-card" onClick={() => alert(t('comingSoon'))}>
            <h3>{t('myRecords')}</h3>
            <p>{t('comingSoon')}</p>
          </div>
        </div>

        <div className="nearby-doctors mt-4">
          <h2 style={{ marginBottom: '4px' }}>{t('nearbyDoctors')}</h2>
          <p style={{ marginBottom: '16px' }}>{t('nearbyDoctorsSub')}</p>

          {dummyDoctors.map((doc) => (
            <div key={doc.id} className="card doctor-card">
              <div className="doc-info">
                <h3>{doc.name}</h3>
                <p><strong>{t('specialization')}:</strong> {doc.specKey}</p>
                <p><strong>{t('hospital')}:</strong> {doc.hospital}</p>
                <p><strong>{t('distance')}:</strong> {doc.dist}</p>
              </div>
              <button 
                className="btn-primary large mt-4" 
                onClick={() => alert(t('requestSent'))}
              >
                {t('requestConsult')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
