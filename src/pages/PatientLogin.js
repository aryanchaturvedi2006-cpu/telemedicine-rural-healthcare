import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

const PatientLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', mobile: '', pin: '' });
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Auto-fill Remembered Login
  const [staySignedIn, setStaySignedIn] = useState(true);
  
  // Forgot PIN Flow
  const [showForgotPin, setShowForgotPin] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetMobile, setResetMobile] = useState('');
  const [foundPatient, setFoundPatient] = useState(null);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  useEffect(() => {
    try {
      const remembered = JSON.parse(localStorage.getItem('rememberedLogin'));
      if (remembered) {
        setFormData(prev => ({ ...prev, name: remembered.name, mobile: remembered.mobile }));
      }
    } catch (e) { 
      // ignore, no saved login 
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError('');
    setIsLoggingIn(true);
    
    try {
      const allPatients = JSON.parse(localStorage.getItem('patients') || '[]');
      let match = allPatients.find(p => 
        p.name && p.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
        p.mobile === formData.mobile &&
        p.pin === formData.pin
      );

      // Fallback: check backend if not found in local storage
      if (!match) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/patients/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile: formData.mobile }),
          });
          const data = await response.json();
          if (response.ok && data.success && data.data) {
            const dbPatient = data.data;
            if (dbPatient.name && dbPatient.name.trim().toLowerCase() === formData.name.trim().toLowerCase()) {
              match = { ...dbPatient, role: 'patient', pin: formData.pin };
              allPatients.push(match);
              localStorage.setItem('patients', JSON.stringify(allPatients));
            }
          }
        } catch (e) {
          console.error("Backend login fallback failed", e);
        }
      }

      if (match) {
        if (staySignedIn) {
          localStorage.setItem('rememberedLogin', JSON.stringify({ 
            name: formData.name, mobile: formData.mobile 
          }));
        } else {
          localStorage.removeItem('rememberedLogin');
        }
        localStorage.setItem('currentPatient', JSON.stringify(match));
        login(match);
        navigate('/patient-dashboard');
      } else {
        setError(t('userNotFoundError') || "⚠️ Details don't match our records. Please check your name, mobile number and PIN, or create a new account.");
        setIsLoggingIn(false);
      }
    } catch (e) {
      console.error(e);
      setError(t('userNotFoundError') || "⚠️ Details don't match our records. Please check your name, mobile number and PIN, or create a new account.");
      setIsLoggingIn(false);
    }
  };

  // Forgot PIN Handlers
  const handleVerifyMobile = () => {
    setError('');
    try {
      const allPatients = JSON.parse(localStorage.getItem('patients') || '[]');
      const found = allPatients.find(p => p.mobile === resetMobile);
      if (found) {
        setFoundPatient(found);
        setResetStep(2);
      } else {
        setError("⚠️ No account found with this mobile number.");
      }
    } catch (e) {
      setError("⚠️ An error occurred. Please try again.");
    }
  };

  const handleResetPin = () => {
    setError('');
    if (newPin.length !== 4) {
      setError("⚠️ PIN must be 4 digits");
      return;
    }
    if (newPin !== confirmNewPin) {
      setError("⚠️ PINs do not match");
      return;
    }
    try {
      const allPatients = JSON.parse(localStorage.getItem('patients') || '[]');
      const updated = allPatients.map(p => 
        p.mobile === foundPatient.mobile ? { ...p, pin: newPin } : p
      );
      localStorage.setItem('patients', JSON.stringify(updated));
      setResetStep(3);
    } catch (e) {
      setError("⚠️ An error occurred while saving. Please try again.");
    }
  };

  const resetForgotPinFlow = () => {
    setShowForgotPin(false);
    setResetStep(1);
    setResetMobile('');
    setNewPin('');
    setConfirmNewPin('');
    setError('');
  };

  const ErrorMessage = ({ msg }) => (
    <div style={{
      background: '#FFEBEE',
      borderLeft: '4px solid #C62828',
      color: '#C62828',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      marginTop: '12px'
    }}>
      {msg}
    </div>
  );

  return (
    <div style={{ background: '#F1F8F1', minHeight: '100vh', padding: '20px' }}>
      <button 
        onClick={() => navigate('/patient-welcome')}
        style={{
          color: '#2E7D32',
          background: 'none',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          padding: '10px',
          marginBottom: '20px'
        }}
      >
        ← Back
      </button>

      <div style={{
        maxWidth: '440px',
        margin: '0 auto',
        padding: '32px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>
        {showForgotPin ? (
          <div>
            <div 
              onClick={resetForgotPinFlow} 
              style={{ fontSize: '12px', color: '#2E7D32', cursor: 'pointer', marginBottom: '16px', fontWeight: 'bold' }}
            >
              ← Back to Login
            </div>
            
            {resetStep === 1 && (
              <>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2E7D32', textAlign: 'center', margin: '0 0 8px 0' }}>
                  Reset Your PIN
                </h1>
                <p style={{ fontSize: '13px', color: '#555', textAlign: 'center', margin: '0 0 24px 0' }}>
                  Enter your registered mobile number
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <input 
                    type="tel" 
                    maxLength={10}
                    value={resetMobile}
                    onChange={(e) => setResetMobile(e.target.value)}
                    placeholder="10-digit mobile number" 
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '10px',
                      border: '1px solid #E0E0E0',
                      padding: '0 12px',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2E7D32'}
                    onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                  />
                </div>

                <button
                  onClick={handleVerifyMobile}
                  style={{
                    width: '100%',
                    height: '52px',
                    backgroundColor: '#2E7D32',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Verify &rarr;
                </button>
                {error && <ErrorMessage msg={error} />}
              </>
            )}

            {resetStep === 2 && (
              <>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2E7D32', textAlign: 'center', margin: '0 0 8px 0' }}>
                  Create New PIN
                </h1>
                <p style={{ fontSize: '13px', color: '#555', textAlign: 'center', margin: '0 0 24px 0' }}>
                  Hi {foundPatient?.name}, set your new 4-digit PIN
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <input 
                    type="password" 
                    inputMode="numeric"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Enter new 4-digit PIN" 
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '10px',
                      border: '1px solid #E0E0E0',
                      padding: '0 12px',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2E7D32'}
                    onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <input 
                    type="password" 
                    inputMode="numeric"
                    maxLength={4}
                    value={confirmNewPin}
                    onChange={(e) => setConfirmNewPin(e.target.value)}
                    placeholder="Re-enter new PIN" 
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '10px',
                      border: '1px solid #E0E0E0',
                      padding: '0 12px',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2E7D32'}
                    onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                  />
                </div>

                <button
                  onClick={handleResetPin}
                  style={{
                    width: '100%',
                    height: '52px',
                    backgroundColor: '#2E7D32',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Reset PIN &rarr;
                </button>
                {error && <ErrorMessage msg={error} />}
              </>
            )}

            {resetStep === 3 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>✅</div>
                <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2E7D32', margin: '0 0 8px 0' }}>
                  PIN Reset Successful!
                </h1>
                <p style={{ fontSize: '13px', color: '#555', margin: '0 0 24px 0' }}>
                  You can now login with your new PIN
                </p>

                <button
                  onClick={resetForgotPinFlow}
                  style={{
                    width: '100%',
                    height: '52px',
                    backgroundColor: '#2E7D32',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Back to Login &rarr;
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', fontSize: '36px', marginBottom: '8px' }}>🔐</div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E7D32', textAlign: 'center', margin: '0 0 8px 0' }}>
              Patient Login
            </h1>
            <p style={{ fontSize: '13px', color: '#555', textAlign: 'center', margin: '0 0 24px 0' }}>
              Enter your details to continue
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid #E0E0E0', marginBottom: '24px' }} />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#333', fontWeight: '500' }}>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name" 
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '10px',
                  border: '1px solid #E0E0E0',
                  padding: '0 12px',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2E7D32'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#333', fontWeight: '500' }}>Mobile Number</label>
              <input 
                type="tel" 
                name="mobile"
                maxLength={10}
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number" 
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '10px',
                  border: '1px solid #E0E0E0',
                  padding: '0 12px',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2E7D32'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
              />
            </div>

            <div style={{ marginBottom: '4px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#333', fontWeight: '500' }}>4-Digit PIN</label>
              <input 
                type="password" 
                inputMode="numeric"
                name="pin"
                maxLength={4}
                value={formData.pin}
                onChange={handleChange}
                placeholder="Enter your PIN" 
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '10px',
                  border: '1px solid #E0E0E0',
                  padding: '0 12px',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2E7D32'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
              />
            </div>

            <div 
              onClick={() => { setShowForgotPin(true); setError(''); }}
              style={{
                fontSize: '12px',
                color: '#1565C0',
                textAlign: 'right',
                cursor: 'pointer',
                textDecoration: 'underline',
                marginTop: '4px'
              }}
            >
              Forgot PIN?
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0 16px 0' }}>
              <input 
                type="checkbox" 
                id="staySignedIn"
                checked={staySignedIn}
                onChange={(e) => setStaySignedIn(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#2E7D32', cursor: 'pointer' }}
              />
              <label 
                htmlFor="staySignedIn"
                style={{ fontSize: '13px', color: '#555', cursor: 'pointer' }}
              >
                Stay signed in on this device
              </label>
            </div>

            <button
              onClick={handleLogin}
              style={{
                width: '100%',
                height: '52px',
                backgroundColor: '#2E7D32',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Login &rarr;
            </button>

            {error && <ErrorMessage msg={error} />}

            <div 
              onClick={() => navigate('/patient-registration')}
              style={{
                color: '#2E7D32',
                fontSize: '14px',
                textAlign: 'center',
                marginTop: '16px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              New user? Create Account &rarr;
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientLogin;
