import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import API_BASE_URL from '../config';

const PatientLogin = () => {
  const { t, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [mobileNumber, setMobileNumber] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) {
      alert(t('invalidMobile'));
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/patients/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobileNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('currentPatient', JSON.stringify({ ...data.patient, role: 'patient' }));
        navigate('/patient-dashboard');
      } else {
        if (data.message === 'Patient not found') {
          alert(t('userNotFoundError'));
        } else {
          alert(data.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error, please try again later.');
    }
  };

  const handleChangeLanguage = () => {
    setLanguage('');
    navigate('/');
  };

  return (
    <div className="form-container">
      <div className="top-bar">
        <button className="btn-text" style={{ marginRight: 'auto' }} onClick={() => navigate('/landing')}>
          ← {t('back')}
        </button>
        <button className="btn-secondary small" onClick={handleChangeLanguage}>
          {t('changeLanguage')}
        </button>
      </div>

      <div className="form-card">
        <div className="form-header">
          <h2>{t('login')}</h2>
          <p>{t('alreadyHaveAccountTile')}</p>
        </div>

        <form onSubmit={handleLogin} className="form-body">
          <div className="input-group">
            <label>{t('mobileNumber')}</label>
            <input 
              type="number" 
              name="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder={t('mobileNumberPH')} 
              className="large-input"
            />
          </div>

          <button type="submit" className="btn-primary large mt-4" style={{ backgroundColor: 'var(--primary-green)' }}>
            {t('login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientLogin;
