import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import './AuthPage.css';

/* Demo accounts — replaced by real API calls in Phase 2 */
const DEMO_USERS = [
  {
    id: 'p1', role: 'patient', email: 'patient@demo.com', password: 'demo1234',
    name: 'Rajesh Kumar', age: 34, gender: 'Male', phone: '9876543210',
    location: 'Rampur Village, Rajasthan',
  },
  {
    id: 'd1', role: 'doctor', email: 'doctor@demo.com', password: 'demo1234',
    name: 'Dr. Priya Sharma', phone: '9123456780', specialization: 'General Medicine',
    hospital: 'District Primary Health Centre', location: 'Jaipur, Rajasthan',
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  const defaultRole = location.state?.role || 'patient';
  const [activeRole, setActiveRole] = useState(defaultRole);
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const matched = DEMO_USERS.find(
        u => u.role === activeRole &&
             u.email === form.email.trim().toLowerCase() &&
             u.password === form.password
      );

      if (matched) {
        login(matched);
        navigate(matched.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
      } else {
        setError('Invalid email or password. Try the demo credentials below.');
      }
      setLoading(false);
    }, 600);
  };

  const fillDemo = () => {
    const demo = DEMO_USERS.find(u => u.role === activeRole);
    setForm({ email: demo.email, password: demo.password });
    setError('');
  };

  return (
    <div className="auth-page">
      <Navbar />
      <main className="auth-main">
        <div className="auth-card">
          {/* Left panel */}
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

          {/* Right form */}
          <div className="auth-card__form">
            <h2 className="auth-form__title">Sign In</h2>
            <p className="auth-form__sub">Choose your account type to continue</p>

            {/* Role selector */}
            <div className="role-tabs">
              <button
                id="tab-patient"
                className={`role-tab ${activeRole === 'patient' ? 'active' : ''}`}
                onClick={() => { setActiveRole('patient'); setError(''); }}
                type="button"
              >
                Patient
              </button>
              <button
                id="tab-doctor"
                className={`role-tab ${activeRole === 'doctor' ? 'active' : ''}`}
                onClick={() => { setActiveRole('doctor'); setError(''); }}
                type="button"
              >
                Doctor
              </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="form-group">
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
                />
              </div>

              <button
                id="btn-login-submit"
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : 'Sign In'}
              </button>
            </form>

            <div className="auth-demo-hint">
              <button type="button" className="btn btn-ghost btn-sm btn-full" onClick={fillDemo}>
                Fill demo {activeRole} credentials
              </button>
            </div>

            <p className="auth-footer-link">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary fw-500">Register here</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
