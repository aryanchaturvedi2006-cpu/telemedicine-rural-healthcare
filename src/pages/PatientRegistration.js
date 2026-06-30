import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getStates } from '../translations/translations';
import API_BASE_URL from '../config';
import VoiceInputButton from '../components/common/VoiceInputButton';
import './TeleMedGlobal.css';

const PatientRegistration = () => {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [networkError, setNetworkError] = useState(false);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    mobileNumber: '',
    pin: '',
    street: '',
    villageCity: '',
    state: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVoiceInput = (fieldName, transcript) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName] ? `${prev[fieldName]} ${transcript}` : transcript
    }));
  };

  const setGender = (val) => {
    setFormData({ ...formData, gender: val });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    if (!formData.fullName || !formData.age || !formData.gender || !formData.mobileNumber || !formData.pin) {
      setError(t('fillAllFields') || 'Please fill all fields');
      return;
    }
    if (formData.mobileNumber.length !== 10) {
      setError(t('invalidMobile') || 'Invalid mobile number');
      return;
    }
    if (formData.pin.length !== 4) {
      setError('PIN must be exactly 4 digits');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.street || !formData.villageCity || !formData.state) {
      setError(t('fillAllFields') || 'Please fill all fields');
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
        const patientObj = { ...data.patient, role: 'patient', pin: formData.pin };
        
        let allPatients = [];
        try { allPatients = JSON.parse(localStorage.getItem('patients') || '[]'); } catch(e) {}
        allPatients.push(patientObj);
        localStorage.setItem('patients', JSON.stringify(allPatients));
        
        login(patientObj);
        localStorage.setItem('currentPatient', JSON.stringify(patientObj));
        navigate('/patient-dashboard');
      } else {
        if (data.message === 'Mobile number already registered') {
          setError(t('mobileExistsError') || 'Mobile number already registered');
        } else {
          setError(data.message || 'Registration failed');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setNetworkError(true);
      const patientObj = {
        name: formData.fullName,
        age: formData.age,
        gender: formData.gender,
        mobile: formData.mobileNumber,
        pin: formData.pin,
        street: formData.street,
        village: formData.villageCity,
        state: formData.state,
        role: 'patient',
        id: 'local-temp-id'
      };
      
      let allPatients = [];
      try { allPatients = JSON.parse(localStorage.getItem('patients') || '[]'); } catch(e) {}
      allPatients.push(patientObj);
      localStorage.setItem('patients', JSON.stringify(allPatients));
      
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder={t('fullNamePH')} className="tm-input" style={{ marginBottom: 0, flex: 1 }} />
              <VoiceInputButton language={language} onResult={(text) => handleVoiceInput('fullName', text)} />
            </div>
            <input type="number" name="age" min="1" max="120" value={formData.age} onChange={handleChange} placeholder={t('agePH')} className="tm-input" style={{ marginTop: '14px' }} />
            <input type="number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder={t('mobileNumberPH')} className="tm-input" />
            
            <div style={{ marginTop: '14px', marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#333', fontWeight: '500', marginBottom: '2px' }}>Set 4-Digit PIN</label>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>You'll use this PIN to login next time</div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric" 
                  maxLength={4} 
                  name="pin" 
                  value={formData.pin} 
                  onChange={handleChange} 
                  placeholder="Enter 4-digit PIN" 
                  className="tm-input" 
                  style={{ margin: 0, paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPin(!showPin)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px' }} tabIndex={-1}>
                  {showPin ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

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
            {error && (
              <div style={{
                background: '#FFEBEE', borderLeft: '4px solid #C62828', color: '#C62828',
                padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginTop: '12px'
              }}>
                {error}
              </div>
            )}
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="tm-form">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
              <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder={t('streetPH')} className="tm-input" style={{ marginBottom: 0, flex: 1 }} />
              <VoiceInputButton language={language} onResult={(text) => handleVoiceInput('street', text)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
              <input type="text" name="villageCity" value={formData.villageCity} onChange={handleChange} placeholder={t('villageCityPH')} className="tm-input" style={{ marginBottom: 0, flex: 1 }} />
              <VoiceInputButton language={language} onResult={(text) => handleVoiceInput('villageCity', text)} />
            </div>
            
            <select name="state" value={formData.state} onChange={handleChange} className="tm-input">
              <option value="">{t('selectState')}</option>
              {getStates(language).map((st, idx) => (
                <option key={idx} value={getStates('en')[idx]}>{st}</option>
              ))}
            </select>

            <button type="submit" className="tm-btn-primary tm-next-btn">
              {t('createAccountBtn')}
            </button>
            {error && (
              <div style={{
                background: '#FFEBEE', borderLeft: '4px solid #C62828', color: '#C62828',
                padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginTop: '12px'
              }}>
                {error}
              </div>
            )}
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
