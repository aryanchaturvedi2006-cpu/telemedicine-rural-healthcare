import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './LandingPage.css';

const features = [
  {
    icon: '🩺',
    title: 'Remote Consultations',
    desc: 'Connect rural patients with qualified doctors through secure video and chat consultations.',
  },
  {
    icon: '📊',
    title: 'AI-Powered Insights',
    desc: 'Machine learning models analyse symptoms and health records to assist clinical decisions.',
  },
  {
    icon: '📁',
    title: 'Digital Health Records',
    desc: 'Maintain and access patient health history from anywhere, securely and instantly.',
  },
  {
    icon: '📍',
    title: 'Rural-First Design',
    desc: 'Optimised for low-bandwidth environments and simple, accessible interfaces for rural users.',
  },
  {
    icon: '🔔',
    title: 'Smart Scheduling',
    desc: 'Automated consultation scheduling and reminders reduce missed appointments.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    desc: 'End-to-end encrypted communications ensure patient data remains private and protected.',
  },
];

const steps = [
  { num: '01', title: 'Register', desc: 'Create your account as a patient or doctor in under 2 minutes.' },
  { num: '02', title: 'Connect', desc: 'Patients book consultations; doctors review and accept requests.' },
  { num: '03', title: 'Consult', desc: 'Attend your session remotely — no travel required.' },
  { num: '04', title: 'Follow-up', desc: 'Access prescriptions, records and next-step guidance anytime.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__content">
          <span className="hero__tag">Phase 1 Prototype</span>
          <h1 className="hero__title">
            Telemedicine Optimization for<br />
            <span className="hero__highlight">Rural Healthcare</span>
          </h1>
          <p className="hero__sub">
            Leveraging AI/ML techniques and data analysis to bridge the healthcare
            gap in underserved rural communities — bringing specialist care within reach.
          </p>
          <div className="hero__actions">
            <button
              id="btn-patient-login"
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/login', { state: { role: 'patient' } })}
            >
              Patient Login
            </button>
            <button
              id="btn-doctor-login"
              className="btn btn-outline btn-lg"
              onClick={() => navigate('/login', { state: { role: 'doctor' } })}
            >
              Doctor Login
            </button>
            <button
              id="btn-register"
              className="btn btn-accent btn-lg"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__card-mock">
            <div className="mock__header">
              <div className="mock__dot red" />
              <div className="mock__dot yellow" />
              <div className="mock__dot green" />
            </div>
            <div className="mock__row">
              <div className="mock__avatar">RK</div>
              <div>
                <div className="mock__name">Rajesh Kumar</div>
                <div className="mock__tag">Patient &bull; Verified</div>
              </div>
              <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Active</span>
            </div>
            <hr className="divider" style={{ margin: '14px 0' }} />
            <div className="mock__label">Upcoming Consultation</div>
            <div className="mock__appt">
              <span className="mock__appt-icon">&#x1F4C5;</span>
              <div>
                <div className="mock__appt-title">Dr. Priya Sharma &mdash; General Medicine</div>
                <div className="mock__appt-time">Today, 3:30 PM &bull; Video Call</div>
              </div>
            </div>
            <div className="mock__label" style={{ marginTop: 14 }}>Vitals Summary</div>
            <div className="mock__vitals">
              <div className="mock__vital"><span>BP</span><strong>118/76</strong></div>
              <div className="mock__vital"><span>HR</span><strong>72 bpm</strong></div>
              <div className="mock__vital"><span>SpO2</span><strong>98%</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────── */}
      <section className="stats-bar">
        <div className="stats-bar__inner">
          <div className="stats-bar__item">
            <strong>65%</strong>
            <span>of India's population lives in rural areas</span>
          </div>
          <div className="stats-bar__divider" />
          <div className="stats-bar__item">
            <strong>1:10,000</strong>
            <span>doctor-to-patient ratio in rural districts</span>
          </div>
          <div className="stats-bar__divider" />
          <div className="stats-bar__item">
            <strong>70%</strong>
            <span>of health issues preventable with early access</span>
          </div>
          <div className="stats-bar__divider" />
          <div className="stats-bar__item">
            <strong>AI-Driven</strong>
            <span>symptom analysis and triage support</span>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="features">
        <div className="features__inner">
          <div className="section-header">
            <h2>Platform Capabilities</h2>
            <p>Built to serve patients and healthcare providers in rural settings.</p>
          </div>
          <div className="features__grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section className="how-it-works">
        <div className="how-it-works__inner">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple steps to access quality healthcare from your village.</p>
          </div>
          <div className="steps">
            {steps.map((s) => (
              <div key={s.num} className="step">
                <div className="step__num">{s.num}</div>
                <div className="step__content">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="cta">
        <div className="cta__inner">
          <h2>Start Your Healthcare Journey</h2>
          <p>Join thousands of rural patients and doctors already using TeleMed Rural.</p>
          <div className="cta__actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Create an Account
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
