import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import AarogyaModal from '../components/common/AarogyaModal';
import './Landing.css';

const Landing = () => {
  const { t, setLanguage, language } = useLanguage();
  const [isAarogyaModalOpen, setIsAarogyaModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    setLanguage('');
    navigate('/');
  };

  return (
    <div className="landing-container">
      <div className="landing-header-top">
        <button className="btn-change-language" onClick={handleBack}>
          ← {t('changeLanguage')}
        </button>
      </div>

      <div className="landing-header-main">
        <h1 className="landing-title">
          <span className="medical-cross">✚</span> TeleMed Rural
        </h1>
        <p className="landing-tagline">Quality Healthcare, Anywhere in India</p>
      </div>

      <div className="landing-grid">
        <button 
          className="landing-card primary-card" 
          onClick={() => navigate('/patient-registration')}
        >
          <div className="card-icon">🩺</div>
          <h2 className="card-title">{t('talkToDoctor')}</h2>
          <p className="card-desc">Get instant medical advice from verified doctors</p>
        </button>

        <button 
          className="landing-card doctor-card" 
          onClick={() => navigate('/doctor-login')}
        >
          <div className="card-icon">👨‍⚕️</div>
          <h2 className="card-title">{t('iAmDoctor')}</h2>
          <p className="card-desc">Join our network and help rural patients</p>
        </button>

        <button 
          className="landing-card secondary-card" 
          onClick={() => navigate('/patient-registration')}
        >
          <div className="card-icon">➕</div>
          <h2 className="card-title">{t('createAccount')}</h2>
          <p className="card-desc">Register with just your name and mobile number</p>
        </button>

        <button 
          className="landing-card secondary-card" 
          onClick={() => navigate('/patient-login')}
        >
          <div className="card-icon">🔑</div>
          <h2 className="card-title">{t('alreadyHaveAccountTile')}</h2>
          <p className="card-desc">Welcome back, continue your care</p>
        </button>
      </div>

      {/* Aarogya AI Chat Section */}
      <div style={{
        marginTop: '40px',
        padding: '32px',
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '16px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '24px',
          backgroundColor: '#2E7D32',
          color: '#fff',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {t('freeService')}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <h2 style={{ color: '#166534', margin: '0 0 8px 0', fontSize: '22px', fontWeight: 'bold' }}>
              {t('aarogyaBannerTitle')}
            </h2>
            <p style={{ color: '#15803d', margin: '0', fontSize: '16px' }}>
              {t('aarogyaBannerSubtitle')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
            <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '10px 20px', borderRadius: '20px', fontSize: '15px', fontWeight: 'bold' }}>🌿 Aarogya AI</span>
            <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '10px 20px', borderRadius: '20px', fontSize: '15px', fontWeight: 'bold' }}>⚡ Instant Reply</span>
            <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '10px 20px', borderRadius: '20px', fontSize: '15px', fontWeight: 'bold' }}>🔒 Confidential</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button
              onClick={() => setIsAarogyaModalOpen(true)}
              style={{
                backgroundColor: '#16a34a',
                color: '#fff',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px',
                whiteSpace: 'nowrap'
              }}
            >
              {t('chatNow')}
            </button>
          </div>
        </div>
      </div>

      {isAarogyaModalOpen && <AarogyaModal onClose={() => setIsAarogyaModalOpen(false)} />}
    </div>
  );
};

export default Landing;
