import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);

  // Forgot Password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cred = await signInWithEmailAndPassword(auth, form.email, form.password);
      const uid = cred.user.uid;

      const snap = await getDoc(doc(db, 'users', uid));
      if (!snap.exists() || snap.data().role !== 'doctor') {
        setError('This account is not registered as a doctor.');
        setLoading(false);
        return;
      }

      const doctorData = { uid, ...snap.data() };
      login(doctorData, staySignedIn);
      navigate('/doctor-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const messages = {
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      setError(messages[err.code] || 'An error occurred during login. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotMsg('');
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotMsg('Password reset link sent to your email. Please check your inbox.');
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      setForgotError(messages[err.code] || 'Failed to send reset email. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  useEffect(() => {
    const styleId = "doctor-login-animations";
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
        @keyframes loginGlow {
          0% { box-shadow: 0 4px 16px rgba(21,101,192,0.30) }
          50% { box-shadow: 0 4px 24px rgba(21,101,192,0.50) }
          100% { box-shadow: 0 4px 16px rgba(21,101,192,0.30) }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif",
      backgroundColor: '#F0F4FF',
      backgroundImage: 'radial-gradient(#1565C0 0.8px, transparent 0.8px)',
      backgroundSize: '22px 22px',
      margin: 0,
      padding: 0
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #0D47A1 45%, #1565C0 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 24px 60px 24px',
        textAlign: 'center'
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px', width: '220px', height: '220px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none'
        }}></div>
        <div style={{
          position: 'absolute', bottom: '10px', left: '-40px', width: '150px', height: '150px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
        }}></div>
        <div style={{
          position: 'absolute', top: '35%', right: '15px', width: '80px', height: '80px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1, animation: 'fadeInDown 0.5s ease forwards' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              position: 'absolute', top: '16px', left: '16px',
              color: 'white', fontSize: '15px', background: 'rgba(255,255,255,0.12)',
              border: 'none', outline: '1px solid rgba(255,255,255,0.25)', borderRadius: '20px',
              padding: '6px 14px', cursor: 'pointer'
            }}
          >
            ← {t('back') || 'Back'}
          </button>

          <div style={{ marginBottom: '28px', marginTop: '40px' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', letterSpacing: '0.5px' }}>🌿 JeevanJyoti</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', letterSpacing: '2.5px' }}>RURAL HEALTHCARE</div>
          </div>

          <div style={{ fontSize: '40px', marginBottom: '8px' }}>👨‍⚕️</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>{t('doctorSignInTitle') || 'Doctor Sign In'}</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: '0 0 24px 0' }}>{t('doctorSignInSub') || 'Access your patient dashboard'}</p>

          <div style={{
            display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeInUp 0.5s ease 0.2s forwards', opacity: 0
          }}>
            <span style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 14px', color: 'white', fontSize: '11px', fontWeight: '500' }}>🏥 Verified Platform</span>
            <span style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 14px', color: 'white', fontSize: '11px', fontWeight: '500' }}>🔒 Secure Login</span>
            <span style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 14px', color: 'white', fontSize: '11px', fontWeight: '500' }}>⚡ Instant Access</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '-2px', lineHeight: 0, overflow: 'hidden' }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#0D47A1"/>
        </svg>
      </div>

      <div style={{ padding: '32px 24px 40px 24px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '420px', margin: '0 auto', animation: 'fadeInUp 0.6s ease 0.3s forwards', opacity: 0 }}>
          
          <div style={{ fontSize: '13px', color: '#555', textAlign: 'center', marginBottom: '20px' }}>
            Sign in to your doctor account
          </div>

          <div style={{
            background: 'white', borderRadius: '20px', padding: '28px 24px',
            boxShadow: '0 4px 24px rgba(21,101,192,0.10)', border: '1px solid #E3EAF8'
          }}>
            <div style={{
              height: '4px',
              background: 'linear-gradient(90deg, #1565C0, #42A5F5, #1565C0)',
              borderRadius: '4px 4px 0 0',
              margin: '-28px -24px 20px -24px'
            }}></div>

            {!showForgotPassword && (
              <div style={{
                display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px',
                background: '#EFF4FF', borderRadius: '10px', padding: '10px 14px', marginBottom: '18px'
              }}>
                <div style={{ fontSize: '24px' }}>👨‍⚕️</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1565C0' }}>Welcome back, Doctor</div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Enter your credentials to continue</div>
                </div>
              </div>
            )}

            {showForgotPassword ? (
              <div>
                <div
                  onClick={() => { setShowForgotPassword(false); setForgotMsg(''); setForgotError(''); setForgotEmail(''); }}
                  style={{ fontSize: '13px', color: '#1565C0', cursor: 'pointer', marginBottom: '16px', fontWeight: 'bold' }}
                >
                  {t('backToLogin') || '← Back to Login'}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1565C0', margin: '0 0 8px 0' }}>{t('resetPassword') || 'Reset Password'}</h3>
                <p style={{ fontSize: '13px', color: '#555', margin: '0 0 20px 0' }}>{t('resetPwdSub') || 'Enter your registered email to receive a password reset link.'}</p>
                <form onSubmit={handleForgotPassword}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#1565C0', marginBottom: '6px' }}>{t('email') || 'Email Address'}</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="doctor@example.com"
                      required
                      style={{
                        width: '100%', height: '50px', borderRadius: '12px', border: '1.5px solid #E0E0E0',
                        padding: '0 16px', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s'
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#1565C0'; e.target.style.borderLeftWidth = '3px'; e.target.style.borderLeftColor = '#1565C0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.08)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.borderLeftWidth = '1.5px'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  {forgotError && <div style={{ backgroundColor: '#E3F2FD', borderLeft: '4px solid #C62828', color: '#C62828', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '12px' }}>⚠️ {forgotError}</div>}
                  {forgotMsg && <div style={{ backgroundColor: '#E8F5E9', borderLeft: '4px solid #2E7D32', color: '#2E7D32', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '12px' }}>✅ {forgotMsg}</div>}
                  <button type="submit" disabled={forgotLoading} style={{
                    width: '100%', height: '54px', minHeight: '54px', background: 'linear-gradient(135deg, #1565C0, #1976D2)',
                    color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'loginGlow 2.5s ease-in-out infinite'
                  }}>
                    {forgotLoading ? '...' : (t('sendNewPwdBtn') || 'Send Reset Link')}
                  </button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#1565C0', marginBottom: '6px' }}>{t('email') || 'Email Address'}</label>
                  <input 
                    type="email" 
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="doctor@example.com" 
                    style={{
                      width: '100%', height: '50px', borderRadius: '12px', border: '1.5px solid #E0E0E0',
                      padding: '0 16px', fontSize: '15px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
                      transition: 'all 0.2s'
                    }}
                    required
                    onFocus={(e) => { e.target.style.borderColor = '#1565C0'; e.target.style.borderLeftWidth = '3px'; e.target.style.borderLeftColor = '#1565C0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.08)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.borderLeftWidth = '1.5px'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                
                <div style={{ marginTop: '16px', marginBottom: '14px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1565C0' }}>{t('password') || 'Password'}</label>
                    <span 
                      onClick={() => { setShowForgotPassword(true); setError(''); }}
                      style={{ fontSize: '12px', color: '#1565C0', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {t('forgotPwd') || 'Forgot Password?'}
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••" 
                      style={{
                        width: '100%', height: '50px', borderRadius: '12px', border: '1.5px solid #E0E0E0',
                        padding: '0 40px 0 16px', fontSize: '15px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
                        transition: 'all 0.2s'
                      }}
                      required
                      onFocus={(e) => { e.target.style.borderColor = '#1565C0'; e.target.style.borderLeftWidth = '3px'; e.target.style.borderLeftColor = '#1565C0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.08)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.borderLeftWidth = '1.5px'; e.target.style.boxShadow = 'none'; }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px', lineHeight: 1
                    }} tabIndex={-1}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <input
                    type="checkbox"
                    checked={staySignedIn}
                    onChange={(e) => setStaySignedIn(e.target.checked)}
                    style={{ width: '17px', height: '17px', accentColor: '#1565C0', cursor: 'pointer', margin: 0 }}
                  />
                  <label style={{ fontSize: '13px', color: '#555', cursor: 'pointer' }} onClick={() => setStaySignedIn(!staySignedIn)}>
                    {t('staySignedIn') || 'Stay signed in on this device'}
                  </label>
                </div>

                {error && <div style={{ backgroundColor: '#E3F2FD', borderLeft: '4px solid #C62828', color: '#C62828', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '12px' }}>{error}</div>}

                <button type="submit" style={{
                  marginTop: '20px', width: '100%', height: '54px', minHeight: '54px',
                  background: 'linear-gradient(135deg, #1565C0, #1976D2)', color: 'white',
                  border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold',
                  cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1,
                  display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  animation: 'loginGlow 2.5s ease-in-out infinite'
                }} disabled={loading}>
                  {loading ? '...' : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>🔐</span>
                      <span>{t('loginBtn') || 'Login to Dashboard'}</span>
                      <span style={{ opacity: 0.8 }}>→</span>
                    </div>
                  )}
                </button>

                <Link to="/doctor-registration" style={{
                  marginTop: '18px', textAlign: 'center', display: 'block',
                  color: '#1565C0', fontSize: '14px', fontWeight: '500', textDecoration: 'none'
                }}>
                  {t('newDoctorRegister') || 'New doctor? Register here'}
                </Link>
                
                <div style={{ marginTop: '20px', borderTop: '1px solid #E8EEF8', paddingTop: '14px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#999' }}>✓ Verified by JKLU</span>
                    <span style={{ fontSize: '10px', color: '#999' }}>✓ End-to-end encrypted</span>
                    <span style={{ fontSize: '10px', color: '#999' }}>✓ HIPAA-safe</span>
                  </div>
                </div>

              </form>
            )}
          </div>

          <div style={{ marginTop: '16px', fontSize: '11px', color: '#999', textAlign: 'center' }}>
            🔒 Your information is private and protected
          </div>
        </div>
      </div>
    </div>
  );
}