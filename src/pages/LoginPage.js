import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import API_BASE_URL from '../config';
import './AuthPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card__panel">
            <div className="auth-panel__logo">+</div>
            <h2 className="auth-panel__title">TeleMed Rural</h2>
            <p className="auth-panel__sub">
              Bringing quality healthcare to every corner of rural India through technology.
            </p>
            <ul className="auth-panel__list">
              <li>Secure doctor-patient consultations</li>
              <li>AI-assisted symptom checker</li>
              <li>Digital health records</li>
              <li>Accessible from any device</li>
            </ul>
          </div>

          <div className="auth-card__form">
            <h2 className="auth-form__title">Doctor Sign In</h2>
            <p className="auth-form__sub">Access your doctor dashboard</p>

            {error && <div className="alert alert-danger" style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="doctor@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
              </div>

              <button
                id="btn-login-submit"
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
                style={{ width: '100%', padding: '12px', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="auth-footer-link" style={{ marginTop: '24px', textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link to="/doctor-registration" className="text-primary fw-500">Register here</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
