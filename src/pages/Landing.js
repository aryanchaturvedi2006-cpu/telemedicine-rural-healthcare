import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Landing = () => {
  const { t, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleBack = () => {
    setLanguage('');
    navigate('/');
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
      <button className="btn-text" style={{ alignSelf: 'flex-start', marginBottom: '24px' }} onClick={handleBack}>
        ← {t('changeLanguage')}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
        <div 
          className="card hero-card" 
          style={{ backgroundColor: 'var(--primary-green)', cursor: 'pointer' }}
          onClick={() => navigate('/patient-registration')}
        >
          <h2>{t('talkToDoctor')}</h2>
        </div>

        <div 
          className="card hero-card" 
          style={{ backgroundColor: 'var(--primary-blue)', cursor: 'pointer' }}
          onClick={() => navigate('/doctor-registration')}
        >
          <h2>{t('iAmDoctor')}</h2>
        </div>

        <div 
          className="card hero-card" 
          style={{ backgroundColor: 'var(--primary-green)', cursor: 'pointer' }}
          onClick={() => navigate('/patient-registration')}
        >
          <h2>{t('createAccount')}</h2>
        </div>
      </div>
    </div>
  );
};

export default Landing;
