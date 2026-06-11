import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getStates } from '../translations/translations';
import API_BASE_URL from '../config';
import './TeleMedGlobal.css';

const PatientRegistration = () => {
  const { t, language, setLanguage } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [networkError, setNetworkError] = useState(false);
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
        const patientObj = { ...data.patient, role: 'patient' };
        login(patientObj);
        localStorage.setItem('currentPatient', JSON.stringify(patientObj));
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
      setNetworkError(true);
      const patientObj = {
        name: formData.fullName,
        age: formData.age,
        gender: formData.gender,
        mobile: formData.mobileNumber,
        street: formData.street,
        village: formData.villageCity,
        state: formData.state,
        role: 'patient',
        id: 'local-temp-id'
      };
      localStorage.setItem('patientData', JSON.stringify(patientObj));
      // Optionally also set currentPatient for other hooks
      localStorage.setItem('currentPatient', JSON.stringify(patientObj));
      login(patientObj);
      setTimeout(() => {
        navigate('/patient-dashboard');
      }, 1500); // Give them time to see the error message
    }
  };

  return (
    <div className="tm-page-container">
      <button className="tm-back-btn" onClick={() => step === 2 ? setStep(1) : navigate(-1)}>
        ← Back
      </button>

      <div className="tm-card tm-form-card">
        <div className="tm-progress-bar-container">
          <div className="tm-progress-text">Step {step} of 2</div>
          <div className="tm-progress-bg">
            <div className="tm-progress-fill" style={{ width: step === 1 ? '50%' : '100%' }}></div>
          </div>
        </div>

        <h2 className="tm-form-title">{step === 1 ? 'Tell us about yourself' : 'Where are you located?'}</h2>
        <p className="tm-form-subtitle">{step === 1 ? 'Enter your details to get started' : 'Help us find doctors near you'}</p>

        {step === 1 ? (
          <form onSubmit={handleNext} className="tm-form">
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder={t('fullNamePH')} className="tm-input" />
            <input type="number" name="age" min="1" max="120" value={formData.age} onChange={handleChange} placeholder={t('agePH')} className="tm-input" />
            <input type="number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder={t('mobileNumberPH')} className="tm-input" />
            
            <div className="tm-gender-selector">
              {['Male', 'Female', 'Other'].map(g => (
                <button
                  key={g}
                  type="button"
                  className={`tm-gender-btn ${formData.gender === g ? 'selected' : ''}`}
                  onClick={() => setGender(g)}
                >
                  {g === 'Male' ? t('male') : g === 'Female' ? t('female') : t('other')}
                </button>
              ))}
            </div>

            <button type="submit" className="tm-btn-primary tm-next-btn">
              {t('next')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="tm-form">
            <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder={t('streetPH')} className="tm-input" />
            <input type="text" name="villageCity" value={formData.villageCity} onChange={handleChange} placeholder={t('villageCityPH')} className="tm-input" />
            
            <select name="state" value={formData.state} onChange={handleChange} className="tm-input">
              <option value="">{t('selectState')}</option>
              {getStates(language).map((st, idx) => (
                <option key={idx} value={getStates('en')[idx]}>{st}</option>
              ))}
            </select>

            <button type="submit" className="tm-btn-primary tm-next-btn">
              {t('createAccountBtn')}
            </button>
            {networkError && (
              <div className="tm-error-banner">
                ⚠️ Could not connect to server. Your data has been saved locally. You can continue.
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default PatientRegistration;
