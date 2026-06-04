import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { INDIAN_STATES } from '../translations/translations';
import API_BASE_URL from '../config';

const PatientRegistration = () => {
  const { t, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    mobileNumber: '',
    street: '',
    villageCity: '',
    state: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setGender = (val) => {
    setFormData({ ...formData, gender: val });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.age || !formData.gender || !formData.mobileNumber) {
      alert(t('fillAllFields'));
      return;
    }
    if (formData.mobileNumber.length !== 10) {
      alert(t('invalidMobile'));
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.street || !formData.villageCity || !formData.state) {
      alert(t('fillAllFields'));
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          age: formData.age,
          gender: formData.gender,
          mobile: formData.mobileNumber,
          street: formData.street,
          village: formData.villageCity,
          state: formData.state,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('currentPatient', JSON.stringify({ ...data.patient, role: 'patient' }));
        navigate('/patient-dashboard');
      } else {
        if (data.message === 'Mobile number already registered') {
          alert(t('mobileExistsError'));
        } else {
          alert(data.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
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
        {step === 2 && (
          <button className="btn-text" style={{ marginRight: 'auto' }} onClick={() => setStep(1)}>
            ← {t('back')}
          </button>
        )}
        <button className="btn-secondary small" onClick={handleChangeLanguage}>
          {t('changeLanguage')}
        </button>
      </div>

      <div className="form-card">
        <div className="form-header">
          <h2>{step === 1 ? t('step1Title') : t('step2Title')}</h2>
          <p>{step === 1 ? t('step1Sub') : t('step2Sub')}</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNext} className="form-body">
            <div className="input-group">
              <label>{t('fullName')}</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={t('fullNamePH')} 
                className="large-input"
              />
            </div>

            <div className="input-group">
              <label>{t('age')}</label>
              <input 
                type="number" 
                name="age"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder={t('agePH')} 
                className="large-input"
              />
            </div>

            <div className="input-group">
              <label>{t('mobileNumber')}</label>
              <input 
                type="number" 
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder={t('mobileNumberPH')} 
                className="large-input"
              />
            </div>

            <div className="input-group">
              <label>{t('gender')}</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button"
                  className="large-input"
                  style={{ 
                    flex: 1, 
                    backgroundColor: formData.gender === 'Male' ? 'var(--primary-green)' : 'white',
                    color: formData.gender === 'Male' ? 'white' : 'var(--text-main)',
                    borderColor: formData.gender === 'Male' ? 'var(--primary-green)' : 'var(--border-color)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setGender('Male')}
                >
                  {t('male')}
                </button>
                <button 
                  type="button"
                  className="large-input"
                  style={{ 
                    flex: 1, 
                    backgroundColor: formData.gender === 'Female' ? 'var(--primary-green)' : 'white',
                    color: formData.gender === 'Female' ? 'white' : 'var(--text-main)',
                    borderColor: formData.gender === 'Female' ? 'var(--primary-green)' : 'var(--border-color)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setGender('Female')}
                >
                  {t('female')}
                </button>
                <button 
                  type="button"
                  className="large-input"
                  style={{ 
                    flex: 1, 
                    backgroundColor: formData.gender === 'Other' ? 'var(--primary-green)' : 'white',
                    color: formData.gender === 'Other' ? 'white' : 'var(--text-main)',
                    borderColor: formData.gender === 'Other' ? 'var(--primary-green)' : 'var(--border-color)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setGender('Other')}
                >
                  {t('other')}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary large mt-4">
              {t('next')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="form-body">
            <div className="input-group">
              <label>{t('street')}</label>
              <input 
                type="text" 
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder={t('streetPH')} 
                className="large-input"
              />
            </div>

            <div className="input-group">
              <label>{t('villageCity')}</label>
              <input 
                type="text" 
                name="villageCity"
                value={formData.villageCity}
                onChange={handleChange}
                placeholder={t('villageCityPH')} 
                className="large-input"
              />
            </div>

            <div className="input-group">
              <label>{t('state')}</label>
              <select 
                name="state" 
                value={formData.state} 
                onChange={handleChange}
                className="large-input"
              >
                <option value="">{t('selectState')}</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary large mt-4" style={{ backgroundColor: 'var(--primary-green)' }}>
              {t('createAccountBtn')}
            </button>
          </form>
        )}
      </div>
      
      {step === 1 && (
        <div className="demo-links mt-4 text-center">
          <button className="btn-text" onClick={() => navigate('/doctor-dashboard')}>
            {t('demoDoctorLogin')}
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientRegistration;
