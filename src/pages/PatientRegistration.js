import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getStates } from '../translations/translations';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import VoiceInputButton from '../components/common/VoiceInputButton';

const PatientRegistration = () => {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    setIsSubmitting(true);
    try {
      const patientsRef = collection(db, 'patients');
      const dupCheck = query(patientsRef, where('mobile', '==', formData.mobileNumber));
      const dupSnap = await getDocs(dupCheck);
      if (!dupSnap.empty) {
        setError(t('mobileExistsError') || 'Mobile number already registered. Please login instead.');
        setIsSubmitting(false);
        return;
      }

      const patientObj = {
        role: 'patient',
        name: formData.fullName,
        age: formData.age,
        gender: formData.gender,
        mobile: formData.mobileNumber,
        pin: formData.pin,
        street: formData.street,
        village: formData.villageCity,
        state: formData.state,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(patientsRef, patientObj);
      const patientForSession = { id: docRef.id, ...patientObj };
      localStorage.setItem('currentPatient', JSON.stringify(patientForSession));
      login(patientForSession);
      navigate('/patient-dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError('⚠️ Could not save your details. Please check your connection and try again.');
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    const styleId = "patient-reg-animations";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px) }
          to { opacity: 1; transform: translateY(0) }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px) }
          to { opacity: 1; transform: translateY(0) }
        }
        @keyframes greenGlow {
          0% { box-shadow: 0 4px 16px rgba(46,125,50,0.30) }
          50% { box-shadow: 0 4px 24px rgba(46,125,50,0.50) }
          100% { box-shadow: 0 4px 16px rgba(46,125,50,0.30) }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const voiceBtnStyle = {
    background: 'rgba(46,125,50,0.08)',
    border: '1px solid rgba(46,125,50,0.2)',
    color: '#2E7D32',
    fontSize: '14px',
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    margin: 0,
    padding: 0
  };

  const inputStyle = {
    width: '100%', height: '48px', border: '1.5px solid #E0E0E0', borderRadius: '12px',
    padding: '0 16px', fontSize: '14px', background: 'white', color: '#1A1A1A',
    marginBottom: '14px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#2E7D32';
    e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.08)';
  };
  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#E0E0E0';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F1F8F1',
      fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif",
      margin: 0,
      padding: 0
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1A472A 0%, #2E7D32 60%, #388E3C 100%)',
        padding: '28px 24px 64px 24px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '10px', left: '-40px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: '30%', right: '20px', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none', zIndex: 0 }}></div>

        <div style={{ position: 'relative', zIndex: 1, animation: 'fadeInDown 0.5s ease forwards' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => step === 2 ? setStep(1) : navigate(-1)}
              style={{
                color: 'white', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '20px', padding: '6px 14px', fontSize: '14px', cursor: 'pointer', outline: 'none', minHeight: '48px', minWidth: '48px'
              }}
            >
              ← {t('back') || 'Back'}
            </button>
            <div></div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>🌿 JeevanJyoti</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', letterSpacing: '2.5px' }}>RURAL HEALTHCARE</div>
          </div>

          <div style={{ marginTop: '20px' }}>
            {step === 1 ? (
              <>
                <div style={{ fontSize: '34px' }}>🏥</div>
                <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: 'white', margin: '8px 0 4px 0' }}>{t('createAccountTitle') || 'Create Your Account'}</h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: '0' }}>{t('createAccountSub') || 'Join JeevanJyoti in just 2 easy steps'}</p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '34px' }}>📍</div>
                <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: 'white', margin: '8px 0 4px 0' }}>{t('almostThereTitle') || 'Almost There!'}</h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: '0' }}>{t('almostThereSub') || "Just your location and you're done"}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '-2px', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#2E7D32"/>
        </svg>
      </div>

      <div style={{
        background: '#F1F8F1',
        backgroundImage: 'radial-gradient(#2E7D32 0.8px, transparent 0.8px)',
        backgroundSize: '22px 22px',
        padding: '0 16px 40px 16px',
        marginTop: '-2px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: 'white', borderRadius: '20px', padding: '28px 24px',
          boxShadow: '0 4px 24px rgba(46,125,50,0.10)', border: '1px solid #C8E6C9',
          maxWidth: '480px', margin: '24px auto 0 auto',
          animation: 'fadeInUp 0.6s ease 0.2s forwards', opacity: 0
        }}>
          <div style={{
            height: '4px',
            background: 'linear-gradient(90deg, #2E7D32, #66BB6A, #2E7D32)',
            borderRadius: '4px 4px 0 0',
            margin: '-28px -24px 20px -24px'
          }}></div>

          <div style={{ fontSize: '12px', color: '#555', textAlign: 'center', marginBottom: '6px' }}>
            Step {step} of 2
          </div>
          <div style={{ height: '6px', background: '#E8F5E9', borderRadius: '3px', marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: step === 1 ? '50%' : '100%',
              background: 'linear-gradient(90deg, #2E7D32, #66BB6A)',
              borderRadius: '3px',
              transition: 'width 0.4s ease'
            }}></div>
          </div>

          <div style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px',
            background: '#E8F5E9', borderRadius: '10px', padding: '10px 14px', marginBottom: '18px'
          }}>
            <div style={{ fontSize: '22px' }}>{step === 1 ? '👤' : '📍'}</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2E7D32' }}>
                {step === 1 ? (t('tellUsAboutTitle') || 'Tell us about yourself') : (t('whereAreYouTitle') || 'Where are you located?')}
              </div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                {step === 1 ? (t('tellUsAboutSub') || 'Basic details to get started') : (t('whereAreYouSub') || 'Help us find doctors near you')}
              </div>
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNext}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#2E7D32', marginBottom: '6px' }}>{t('fullName')}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t('fullNamePH')}
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    onFocus={handleInputFocus} onBlur={handleInputBlur}
                  />
                  <VoiceInputButton language={language} onResult={(text) => handleVoiceInput('fullName', text)} customStyle={voiceBtnStyle} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#2E7D32', marginBottom: '6px' }}>{t('age') || 'Age'}</label>
                <input
                  type="number"
                  name="age"
                  min="1" max="120"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder={t('agePH')}
                  style={inputStyle}
                  onFocus={handleInputFocus} onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#2E7D32', marginBottom: '6px' }}>{t('mobileNumber')}</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  maxLength={10}
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder={t('mobileNumberPH')}
                  style={inputStyle}
                  onFocus={handleInputFocus} onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#2E7D32', marginBottom: '6px' }}>{t('setPin') || 'Set 4-Digit PIN'}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={4}
                    name="pin"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                    placeholder={t('enterPin') || "Enter 4-digit PIN"}
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    onFocus={handleInputFocus} onBlur={handleInputBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    style={{
                      background: 'rgba(46,125,50,0.08)', border: '1px solid rgba(46,125,50,0.2)', color: '#2E7D32',
                      fontSize: '14px', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '32px', minWidth: '32px'
                    }}
                    tabIndex={-1}
                  >
                    {showPin ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#2E7D32', marginBottom: '6px' }}>{t('gender') || 'Gender'}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Male', 'Female', 'Other'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      style={{
                        flex: 1, height: '44px', minHeight: '48px',
                        background: formData.gender === g ? '#2E7D32' : 'white',
                        color: formData.gender === g ? 'white' : '#555',
                        border: `1.5px solid ${formData.gender === g ? '#2E7D32' : '#E0E0E0'}`,
                        borderRadius: '12px', fontSize: '14px', cursor: 'pointer',
                        boxShadow: formData.gender === g ? '0 2px 8px rgba(46,125,50,0.25)' : 'none',
                        transition: 'all 0.2s', outline: 'none'
                      }}
                    >
                      {g === 'Male' ? (t('male') || 'Male') : g === 'Female' ? (t('female') || 'Female') : (t('other') || 'Other')}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" style={{
                width: '100%', height: '52px', minHeight: '52px', background: 'linear-gradient(135deg, #2E7D32, #388E3C)',
                color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 'bold',
                cursor: 'pointer', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                animation: 'greenGlow 2.5s ease-in-out infinite', outline: 'none'
              }}>
                {t('next') || 'Continue'} →
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
            <form onSubmit={handleSubmit}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#2E7D32', marginBottom: '6px' }}>{t('street') || 'Street / Area'}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder={t('streetPH')}
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    onFocus={handleInputFocus} onBlur={handleInputBlur}
                  />
                  <VoiceInputButton language={language} onResult={(text) => handleVoiceInput('street', text)} customStyle={voiceBtnStyle} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#2E7D32', marginBottom: '6px' }}>{t('villageCity') || 'Village / City'}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="villageCity"
                    value={formData.villageCity}
                    onChange={handleChange}
                    placeholder={t('villageCityPH')}
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    onFocus={handleInputFocus} onBlur={handleInputBlur}
                  />
                  <VoiceInputButton language={language} onResult={(text) => handleVoiceInput('villageCity', text)} customStyle={voiceBtnStyle} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#2E7D32', marginBottom: '6px' }}>{t('state')}</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={handleInputFocus} onBlur={handleInputBlur}
                >
                  <option value="">{t('selectState')}</option>
                  {getStates(language).map((st, idx) => (
                    <option key={idx} value={getStates('en')[idx]}>{st}</option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={isSubmitting} style={{
                width: '100%', height: '52px', minHeight: '52px', background: 'linear-gradient(135deg, #2E7D32, #388E3C)',
                color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: isSubmitting ? 0.85 : 1,
                animation: 'greenGlow 2.5s ease-in-out infinite', outline: 'none'
              }}>
                {isSubmitting ? 'Saving...' : <>🎉 {t('createAccountBtn') || 'Create My Account'} →</>}
              </button>

              <div style={{ marginTop: '16px', borderTop: '1px solid #E8F5E9', paddingTop: '14px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', color: '#999' }}>✓ Free to Join</span>
                <span style={{ fontSize: '10px', color: '#999' }}>✓ Secure & Private</span>
                <span style={{ fontSize: '10px', color: '#999' }}>✓ Rural Healthcare</span>
              </div>

              {error && (
                <div style={{
                  background: '#FFEBEE', borderLeft: '4px solid #C62828', color: '#C62828',
                  padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginTop: '12px'
                }}>
                  {error}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;