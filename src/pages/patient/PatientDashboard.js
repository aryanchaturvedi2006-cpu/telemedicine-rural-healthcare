import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import './PatientDashboard.css';

/* ── Static placeholder data ───────────────────────────── */
const CONSULTATIONS = [
  { id: 1, doctor: 'Dr. Priya Sharma', spec: 'General Medicine', date: 'Today', time: '3:30 PM', mode: 'Video Call', status: 'confirmed' },
  { id: 2, doctor: 'Dr. Arvind Patel', spec: 'Cardiology',       date: '08 Jun 2026', time: '10:00 AM', mode: 'Video Call', status: 'pending' },
];

const HEALTH_RECORDS = [
  { id: 1, name: 'Blood Test Report',    date: '12 May 2026', type: 'Lab',        status: 'normal'  },
  { id: 2, name: 'Chest X-Ray',          date: '28 Apr 2026', type: 'Radiology',  status: 'normal'  },
  { id: 3, name: 'ECG Report',           date: '02 Mar 2026', type: 'Cardiology', status: 'review'  },
  { id: 4, name: 'Prescription – April', date: '28 Apr 2026', type: 'Rx',         status: 'normal'  },
];

const MEDICAL_HISTORY = [
  { condition: 'Hypertension',      since: '2021', status: 'Ongoing'    },
  { condition: 'Type 2 Diabetes',   since: '2022', status: 'Managed'    },
  { condition: 'Seasonal Allergies',since: '2018', status: 'Occasional' },
];

const VITALS = [
  { label: 'Blood Pressure', value: '118/76 mmHg', icon: '♥', color: 'green'  },
  { label: 'Heart Rate',     value: '72 bpm',       icon: '~', color: 'blue'   },
  { label: 'SpO2',           value: '98%',           icon: 'O', color: 'blue'   },
  { label: 'Blood Sugar',    value: '105 mg/dL',     icon: '%', color: 'orange' },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'P';

  return (
    <div className="dashboard-page">
      <Navbar variant="dashboard" />

      <div className="dashboard-layout">
        {/* ── Sidebar ─────────────────────────────── */}
        <aside className="sidebar">
          <div className="sidebar__profile">
            <div className="avatar avatar-lg">{initials}</div>
            <div>
              <div className="sidebar__name">{user?.name || 'Patient'}</div>
              <div className="sidebar__role">Patient</div>
            </div>
          </div>

          <nav className="sidebar__nav">
            {[
              { key: 'overview',      label: 'Overview'          },
              { key: 'consultations', label: 'My Consultations'  },
              { key: 'records',       label: 'Health Records'    },
              { key: 'history',       label: 'Medical History'   },
            ].map(item => (
              <button
                key={item.key}
                id={`sidebar-${item.key}`}
                className={`sidebar__link ${activeSection === item.key ? 'active' : ''}`}
                onClick={() => setActiveSection(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="sidebar__quick-actions">
            <p className="sidebar__section-label">Quick Actions</p>
            <button
              id="btn-book-consultation"
              className="btn btn-accent btn-full"
              onClick={() => setBookingOpen(true)}
            >
              Book Consultation
            </button>
            <button
              id="btn-symptom-checker"
              className="btn btn-ghost btn-full mt-sm"
              title="AI feature — coming in Phase 2"
              onClick={() => alert('AI Symptom Checker will be available in Phase 2.')}
            >
              Symptom Checker
              <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>Phase 2</span>
            </button>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────── */}
        <main className="dashboard-main">

          {/* Overview */}
          {activeSection === 'overview' && (
            <>
              <div className="dashboard-header">
                <div>
                  <h1 className="dashboard-title">Welcome back, {user?.name?.split(' ')[0] || 'Patient'}</h1>
                  <p className="text-muted text-sm">Here is your health summary for today.</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid-4">
                {VITALS.map(v => (
                  <div key={v.label} className="stat-card">
                    <div className={`stat-icon ${v.color}`}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{v.icon}</span>
                    </div>
                    <div>
                      <div className="stat-value" style={{ fontSize: '1.1rem' }}>{v.value}</div>
                      <div className="stat-label">{v.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Profile + Upcoming */}
              <div className="grid-2 mt-md">
                {/* Profile Card */}
                <div className="card">
                  <h3 className="section-title">Patient Profile</h3>
                  <div className="profile-row">
                    <div className="avatar avatar-xl">{initials}</div>
                    <div className="profile-info">
                      <h2 style={{ color: 'var(--clr-text)', marginBottom: 4 }}>{user?.name}</h2>
                      <span className="badge badge-primary">Patient</span>
                    </div>
                  </div>
                  <hr className="divider" />
                  <div className="profile-fields">
                    {[
                      { label: 'Age',      value: user?.age      || '—' },
                      { label: 'Gender',   value: user?.gender   || '—' },
                      { label: 'Email',    value: user?.email    || '—' },
                      { label: 'Phone',    value: user?.phone    || '—' },
                      { label: 'Location', value: user?.location || '—' },
                    ].map(f => (
                      <div key={f.label} className="profile-field">
                        <span className="profile-field__label">{f.label}</span>
                        <span className="profile-field__value">{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Consultations */}
                <div className="card">
                  <div className="flex-between mb-md">
                    <h3 className="section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
                      Upcoming Consultations
                    </h3>
                    <button
                      className="btn btn-accent btn-sm"
                      onClick={() => setBookingOpen(true)}
                    >
                      + Book
                    </button>
                  </div>
                  <div className="consult-list">
                    {CONSULTATIONS.map(c => (
                      <div key={c.id} className="consult-item">
                        <div className="consult-item__avatar">
                          {c.doctor.split(' ').slice(-1)[0][0]}
                        </div>
                        <div className="consult-item__info">
                          <div className="consult-item__doctor">{c.doctor}</div>
                          <div className="consult-item__spec">{c.spec}</div>
                          <div className="consult-item__time">{c.date} &bull; {c.time} &bull; {c.mode}</div>
                        </div>
                        <span className={`badge badge-${c.status === 'confirmed' ? 'success' : 'warning'}`}>
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Health Records */}
              <div className="card mt-md">
                <div className="flex-between mb-md">
                  <h3 className="section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
                    Recent Health Records
                  </h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveSection('records')}>
                    View All
                  </button>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HEALTH_RECORDS.slice(0, 3).map(r => (
                      <tr key={r.id}>
                        <td className="fw-500">{r.name}</td>
                        <td><span className="badge badge-muted">{r.type}</span></td>
                        <td className="text-muted text-sm">{r.date}</td>
                        <td>
                          <span className={`badge badge-${r.status === 'normal' ? 'success' : 'warning'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-ghost btn-sm">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Consultations Section */}
          {activeSection === 'consultations' && (
            <>
              <div className="dashboard-header">
                <h1 className="dashboard-title">My Consultations</h1>
                <button className="btn btn-accent" onClick={() => setBookingOpen(true)}>
                  + Book New
                </button>
              </div>
              <div className="card">
                <h3 className="section-title">All Consultations</h3>
                <div className="consult-list">
                  {CONSULTATIONS.map(c => (
                    <div key={c.id} className="consult-item consult-item--lg">
                      <div className="consult-item__avatar">
                        {c.doctor.split(' ').slice(-1)[0][0]}
                      </div>
                      <div className="consult-item__info">
                        <div className="consult-item__doctor">{c.doctor}</div>
                        <div className="consult-item__spec">{c.spec}</div>
                        <div className="consult-item__time">{c.date} &bull; {c.time} &bull; {c.mode}</div>
                      </div>
                      <div className="flex flex-col" style={{ gap: 6, alignItems: 'flex-end' }}>
                        <span className={`badge badge-${c.status === 'confirmed' ? 'success' : 'warning'}`}>
                          {c.status}
                        </span>
                        <button className="btn btn-primary btn-sm">Join</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Health Records Section */}
          {activeSection === 'records' && (
            <>
              <div className="dashboard-header">
                <h1 className="dashboard-title">Health Records</h1>
                <button className="btn btn-primary">+ Upload Record</button>
              </div>
              <div className="card">
                <h3 className="section-title">All Documents</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Document Name</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HEALTH_RECORDS.map(r => (
                      <tr key={r.id}>
                        <td className="fw-500">{r.name}</td>
                        <td><span className="badge badge-muted">{r.type}</span></td>
                        <td className="text-muted text-sm">{r.date}</td>
                        <td>
                          <span className={`badge badge-${r.status === 'normal' ? 'success' : 'warning'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex flex-gap-sm">
                            <button className="btn btn-ghost btn-sm">View</button>
                            <button className="btn btn-ghost btn-sm">Download</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Medical History Section */}
          {activeSection === 'history' && (
            <>
              <div className="dashboard-header">
                <h1 className="dashboard-title">Medical History</h1>
              </div>
              <div className="alert alert-info">
                Medical history is populated from consultation records. Full AI analysis will be available in Phase 2.
              </div>
              <div className="card">
                <h3 className="section-title">Known Conditions</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Condition</th>
                      <th>Diagnosed Since</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MEDICAL_HISTORY.map(h => (
                      <tr key={h.condition}>
                        <td className="fw-500">{h.condition}</td>
                        <td className="text-muted text-sm">{h.since}</td>
                        <td>
                          <span className={`badge ${
                            h.status === 'Ongoing' ? 'badge-warning' :
                            h.status === 'Managed' ? 'badge-success' : 'badge-muted'
                          }`}>
                            {h.status}
                          </span>
                        </td>
                        <td><button className="btn btn-ghost btn-sm">Details</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ── Book Consultation Modal ──────────────── */}
      {bookingOpen && (
        <div className="modal-overlay" onClick={() => setBookingOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2>Book Consultation</h2>
              <button className="modal__close" onClick={() => setBookingOpen(false)}>&#10005;</button>
            </div>
            <div className="modal__body">
              <div className="form-group">
                <label>Specialization Needed</label>
                <select className="form-control">
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Gynaecology</option>
                  <option>Paediatrics</option>
                  <option>Orthopaedics</option>
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="form-group">
                  <label>Preferred Time</label>
                  <input type="time" className="form-control" />
                </div>
              </div>
              <div className="form-group">
                <label>Consultation Mode</label>
                <select className="form-control">
                  <option>Video Call</option>
                  <option>Voice Call</option>
                  <option>Chat</option>
                </select>
              </div>
              <div className="form-group">
                <label>Describe Your Symptoms</label>
                <textarea className="form-control" rows="3" placeholder="Briefly describe what you are experiencing..."></textarea>
              </div>
            </div>
            <div className="modal__footer">
              <button className="btn btn-ghost" onClick={() => setBookingOpen(false)}>Cancel</button>
              <button
                className="btn btn-accent"
                onClick={() => { alert('Consultation request submitted! A doctor will confirm shortly.'); setBookingOpen(false); }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
