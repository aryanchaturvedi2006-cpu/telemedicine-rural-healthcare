import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const DoctorDashboard = () => {
  const { t, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setLanguage('');
    navigate('/');
  };

  return (
    <div className="dashboard-container doctor-theme">
      <header className="dash-header">
        <div className="header-info">
          <h1>{t('hello')}, Dr. Sharma</h1>
          <p>{t('doctorPanel')}</p>
        </div>
        <button className="btn-secondary small" onClick={handleLogout}>
          {t('logout')}
        </button>
      </header>

      <div className="dash-body">
        <div className="card hero-card" onClick={() => alert(t('comingSoon'))}>
          <h2>{t('newRequests')}</h2>
          <p>{t('noRequests')}</p>
        </div>

        <div className="action-grid">
          <div className="card small-card" onClick={() => alert(t('comingSoon'))}>
            <h3>{t('todayAppt')}</h3>
            <p>{t('noConsult')}</p>
          </div>

          <div className="card small-card" onClick={() => alert(t('comingSoon'))}>
            <h3>{t('myPatients')}</h3>
            <p>{t('noPatients')}</p>
          </div>

          <div className="card small-card" onClick={() => alert(t('comingSoon'))}>
            <h3>{t('availability')}</h3>
            <p>{t('available')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
