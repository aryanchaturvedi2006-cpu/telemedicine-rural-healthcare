import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import './AuthPage.css';

const PATIENT_FIELDS = [
  { name: 'name',     label: 'Full Name',        type: 'text',   placeholder: 'e.g. Ramesh Yadav',          required: true },
  { name: 'age',      label: 'Age',               type: 'number', placeholder: 'e.g. 32',                   required: true },
  { name: 'gender',   label: 'Gender',            type: 'select', options: ['Male','Female','Other'],         required: true },
  { name: 'email',    label: 'Email Address',     type: 'email',  placeholder: 'you@example.com',            required: true },
  { name: 'phone',    label: 'Phone Number',      type: 'tel',    placeholder: '10-digit mobile number',     required: true },
  { name: 'location', label: 'Village / Location',type: 'text',   placeholder: 'e.g. Rampur, Rajasthan',    required: true },
  { name: 'password', label: 'Password',          type: 'password', placeholder: 'Minimum 8 characters',    required: true },
];

const DOCTOR_FIELDS = [
  { name: 'name',           label: 'Full Name',           type: 'text',   placeholder: 'e.g. Dr. Anjali Singh',      required: true },
  { name: 'email',          label: 'Email Address',       type: 'email',  placeholder: 'doctor@example.com',         required: true },
  { name: 'phone',          label: 'Phone Number',        type: 'tel',    placeholder: '10-digit mobile number',      required: true },
  { name: 'specialization', label: 'Specialization',      type: 'text',   placeholder: 'e.g. General Medicine',      required: true },
  { name: 'hospital',       label: 'Hospital / Clinic',   type: 'text',   placeholder: 'e.g. District PHC',          required: true },
  { name: 'location',       label: 'Location',            type: 'text',   placeholder: 'e.g. Jaipur, Rajasthan',     required: true },
  { name: 'password',       label: 'Password',            type: 'password', placeholder: 'Minimum 8 characters',    required: true },
];

const emptyPatient = { name:'', age:'', gender:'', email:'', phone:'', location:'', password:'' };
const emptyDoctor  = { name:'', email:'', phone:'', specialization:'', hospital:'', location:'', password:'' };

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [role, setRole]       = useState('patient');
  const [form, setForm]       = useState(emptyPatient);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const fields = role === 'patient' ? PATIENT_FIELDS : DOCTOR_FIELDS;

  const handleRoleChange = (r) => {
    setRole(r);
    setForm(r === 'patient' ? emptyPatient : emptyDoctor);
    setErrors({});
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    fields.forEach(f => {
      if (f.required && !form[f.name]?.toString().trim()) {
        errs[f.name] = `${f.label} is required`;
      }
    });
    if (form.password && form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.phone && !/^\d{10}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit phone number';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        role,
        ...form,
        ...(role === 'patient' ? {} : {}),
      };
      login(newUser);
      navigate(role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-page">
      <Navbar />
      <main className="auth-main" style={{ padding: '32px 16px' }}>
        <div className="auth-card auth-card--wide">
          {/* Left panel */}
          <div className="auth-card__panel">
            <div className="auth-panel__logo">+</div>
            <h2 className="auth-panel__title">Join TeleMed Rural</h2>
            <p className="auth-panel__sub">
              Create your account to access quality healthcare services, no matter where you are.
            </p>
            <ul className="auth-panel__list">
              <li>Free to register</li>
              <li>Secure health data storage</li>
              <li>Connect with specialist doctors</li>
              <li>Rural-friendly interface</li>
            </ul>
          </div>

          {/* Right form */}
          <div className="auth-card__form">
            <h2 className="auth-form__title">Create Account</h2>
            <p className="auth-form__sub">Select your role to get started</p>

            <div className="role-tabs">
              <button
                id="reg-tab-patient"
                className={`role-tab ${role === 'patient' ? 'active' : ''}`}
                type="button"
                onClick={() => handleRoleChange('patient')}
              >
                Patient
              </button>
              <button
                id="reg-tab-doctor"
                className={`role-tab ${role === 'doctor' ? 'active' : ''}`}
                type="button"
                onClick={() => handleRoleChange('doctor')}
              >
                Doctor
              </button>
            </div>

            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="register-grid">
                {fields.map(f => (
                  <div
                    key={f.name}
                    className={`form-group ${f.name === 'password' ? 'full-span' : ''}`}
                  >
                    <label htmlFor={`reg-${f.name}`}>{f.label}</label>
                    {f.type === 'select' ? (
                      <select
                        id={`reg-${f.name}`}
                        name={f.name}
                        className={`form-control ${errors[f.name] ? 'error' : ''}`}
                        value={form[f.name] || ''}
                        onChange={handleChange}
                      >
                        <option value="">Select {f.label}</option>
                        {f.options.map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={`reg-${f.name}`}
                        name={f.name}
                        type={f.type}
                        className={`form-control ${errors[f.name] ? 'error' : ''}`}
                        placeholder={f.placeholder}
                        value={form[f.name] || ''}
                        onChange={handleChange}
                        autoComplete={f.name === 'password' ? 'new-password' : 'off'}
                      />
                    )}
                    {errors[f.name] && (
                      <span className="form-error">{errors[f.name]}</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                id="btn-register-submit"
                type="submit"
                className="btn btn-primary btn-full mt-md"
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : `Register as ${role === 'patient' ? 'Patient' : 'Doctor'}`}
              </button>
            </form>

            <p className="auth-footer-link">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-500">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
