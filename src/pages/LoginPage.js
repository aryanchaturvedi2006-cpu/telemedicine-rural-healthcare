import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const response = await fetch(`${API_BASE_URL}/api/doctors/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        login({ ...data.data, role: 'doctor' });
        navigate('/doctor-dashboard');
      } else {
        setError(data.message || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again later.');
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
      const res = await fetch(`${API_BASE_URL}/api/doctors/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMsg('New password sent to your email. Please check your inbox.');
      } else {
        setForgotError(data.message || 'Failed to send reset email.');
      }
    } catch (err) {
      setForgotError('An error occurred. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#F0F4FF',
    fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '16px',
    boxSizing: 'border-box'
  };

  const backBtnStyle = {
    position: 'absolute',
    top: '16px',
    left: '16px',
    background: 'none',
    border: 'none',
    color: '#1565C0',
    fontSize: '15px',
    cursor: 'pointer',
    minHeight: '52px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    maxWidth: '440px',
    width: '100%',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    boxSizing: 'border-box'
  };

  const inputStyle = {
    width: '100%',
    height: '48px',
    borderRadius: '10px',
    border: '1.5px solid #E0E0E0',
    padding: '12px 44px 12px 16px',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '6px'
  };

  const btnStyle = {
    width: '100%',
    height: '52px',
    backgroundColor: '#1565C0',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '8px'
  };

  const errorStyle = {
    backgroundColor: '#E3F2FD',
    borderLeft: '4px solid #C62828',
    color: '#C62828',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '12px'
  };

  const eyeBtnStyle = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px',
    lineHeight: 1
  };

  return (
    <div style={containerStyle}>
      <button 
        style={backBtnStyle} 
        onClick={() => navigate(-1)}
        onMouseOver={(e) => e.target.style.color = '#0D47A1'}
        onMouseOut={(e) => e.target.style.color = '#1565C0'}
      >
        ← Back
      </button>
      
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', fontSize: '44px', marginBottom: '8px' }}>👨‍⚕️</div>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1565C0', textAlign: 'center', margin: '0 0 4px 0' }}>Doctor Sign In</h2>
        <p style={{ fontSize: '13px', color: '#555', textAlign: 'center', margin: '0' }}>Access your patient dashboard</p>
        
        <div style={{ borderTop: '1px solid #E0E0E0', margin: '16px 0' }}></div>

        {showForgotPassword ? (
          <div>
            <div
              onClick={() => { setShowForgotPassword(false); setForgotMsg(''); setForgotError(''); setForgotEmail(''); }}
              style={{ fontSize: '13px', color: '#1565C0', cursor: 'pointer', marginBottom: '16px', fontWeight: 'bold' }}
            >
              ← Back to Login
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1565C0', margin: '0 0 8px 0' }}>Reset Password</h3>
            <p style={{ fontSize: '13px', color: '#555', margin: '0 0 20px 0' }}>Enter your registered email to receive a temporary password.</p>
            <form onSubmit={handleForgotPassword}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="doctor@example.com"
                  required
                  style={{ ...inputStyle, padding: '12px 16px' }}
                  onFocus={(e) => e.target.style.borderColor = '#1565C0'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                />
              </div>
              {forgotError && <div style={errorStyle}>⚠️ {forgotError}</div>}
              {forgotMsg && <div style={{ backgroundColor: '#E8F5E9', borderLeft: '4px solid #2E7D32', color: '#2E7D32', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '12px' }}>✅ {forgotMsg}</div>}
              <button type="submit" disabled={forgotLoading} style={btnStyle}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0D47A1'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#1565C0'}
              >
                {forgotLoading ? 'Sending...' : 'Send Reset Password'}
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="email" style={labelStyle}>Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="doctor@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                style={{ ...inputStyle, padding: '12px 16px' }}
                onFocus={(e) => e.target.style.borderColor = '#1565C0'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
              />
            </div>
            
            <div style={{ marginBottom: '8px' }}>
              <label htmlFor="password" style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#1565C0'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtnStyle} tabIndex={-1}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <span
                onClick={() => { setShowForgotPassword(true); setError(''); }}
                style={{ fontSize: '13px', color: '#1565C0', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Forgot Password?
              </span>
            </div>

            {error && <div style={errorStyle}>⚠️ {error}</div>}

            <button
              type="submit"
              disabled={loading}
              style={btnStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0D47A1'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#1565C0'}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#555' }}>
          Don't have an account?{' '}
          <Link to="/doctor-registration" style={{ color: '#1565C0', textDecoration: 'none' }}>Register here →</Link>
        </p>
      </div>
    </div>
  );
}
