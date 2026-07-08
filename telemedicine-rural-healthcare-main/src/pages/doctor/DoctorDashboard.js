import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import '../patient/PatientDashboard.css';
import './DoctorDashboard.css';

/* ── Static placeholder data ───────────────────────────── */
const REQUESTS = [
  { id: 1, patient: 'Ramesh Yadav',   age: 45, location: 'Sikar, Rajasthan',    symptom: 'Chest pain and shortness of breath', time: '2h ago',   urgent: true  },
  { id: 2, patient: 'Sunita Devi',    age: 32, location: 'Alwar, Rajasthan',    symptom: 'High fever, body ache for 3 days',   time: '4h ago',   urgent: false },
  { id: 3, patient: 'Mohan Lal',      age: 60, location: 'Tonk, Rajasthan',     symptom: 'Knee pain and swelling',             time: '6h ago',   urgent: false },
  { id: 4, patient: 'Kavita Singh',   age: 28, location: 'Bhilwara, Rajasthan', symptom: 'Prenatal consultation — 7 months',   time: 'Yesterday', urgent: false },
];

const PATIENTS = [
  { id: 1, name: 'Rajesh Kumar',  age: 34, gender: 'Male',   condition: 'Hypertension',       lastVisit: '28 Apr 2026', status: 'stable'   },
  { id: 2, name: 'Sunita Devi',   age: 32, gender: 'Female', condition: 'Fever',               lastVisit: '01 Jun 2026', status: 'review'   },
  { id: 3, name: 'Vikram Meena',  age: 52, gender: 'Male',   condition: 'Type 2 Diabetes',     lastVisit: '15 May 2026', status: 'stable'   },
  { id: 4, name: 'Priti Sharma',  age: 24, gender: 'Female', condition: 'Thyroid Disorder',    lastVisit: '10 May 2026', status: 'stable'   },
  { id: 5, name: 'Abdul Rahman',  age: 67, gender: 'Male',   condition: 'Cardiac Monitoring',  lastVisit: '05 Jun 2026', status: 'critical' },
];

const UPCOMING = [
  { id: 1, patient: 'Rajesh Kumar', time: 'Today, 3:30 PM',  mode: 'Video Call', spec: 'Follow-up' },
  { id: 2, patient: 'Mohan Lal',    time: 'Today, 5:00 PM',  mode: 'Video Call', spec: 'Ortho'     },
  { id: 3, patient: 'Kavita Singh', time: '07 Jun, 10:00 AM', mode: 'Chat',      spec: 'Prenatal'  },
];

const STATS = [
  { label: 'Total Patients',      value: '48',  icon: 'P', color: 'blue'   },
  { label: 'Today\'s Sessions',   value: '6',   icon: 'S', color: 'green'  },
  { label: 'Pending Requests',    value: '4',   icon: 'R', color: 'orange' },
  { label: 'Consultations Done',  value: '312', icon: 'C', color: 'purple' },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [available, setAvailable]       = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [requests, setRequests]         = useState(REQUESTS);

  const initials = user?.name
    ? user.name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'D';

  const handleAccept  = (id) => setRequests(prev => prev.filter(r => r.id !== id));
  const handleDecline = (id) => setRequests(prev => prev.filter(r => r.id !== id));

  return (
    <div className="dashboard-page">
      <Navbar variant="dashboard" />

      <div className="dashboard-layout">
        {/* ── Sidebar ─────────────────────────────── */}
        <aside className="sidebar">
          <div className="sidebar__profile">
            <div className="avatar avatar-lg">{initials}</div>
            <div>
              <div className="sidebar__name">{user?.name || 'Doctor'}</div>
              <div className="sidebar__role">{user?.specialization || 'Doctor'}</div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="availability-card">
            <span className="availability-label">Availability</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={available}
                onChange={() => setAvailable(prev => !prev)}
                id="toggle-availability"
              />
              <span className="toggle-slider" />
            </label>
            <span className={`badge ${available ? 'badge-success' : 'badge-danger'}`}>
              {available ? 'Available' : 'Unavailable'}
            </span>
          </div>

          <nav className="sidebar__nav">
            {[
              { key: 'overview',  label: 'Overview'           },
              { key: 'requests',  label: 'Consultation Requests' },
              { key: 'patients',  label: 'Patient List'        },
              { key: 'schedule',  label: 'Schedule'            },
            ].map(item => (
              <button
                key={item.key}
                id={`doc-sidebar-${item.key}`}
                className={`sidebar__link ${activeSection === item.key ? 'active' : ''}`}
                onClick={() => { setActiveSection(item.key); setSelectedPatient(null); }}
              >
                {item.label}
                {item.key === 'requests' && requests.length > 0 && (
                  <span className="sidebar__badge">{requests.length}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Main Content ─────────────────────────── */}
        <main className="dashboard-main">

          {/* Overview */}
          {activeSection === 'overview' && (
            <>
              <div className="dashboard-header">
                <div>
                  <h1 className="dashboard-title">
                    Welcome, {user?.name || 'Doctor'}
                  </h1>
                  <p className="text-muted text-sm">
                    {user?.specialization} &bull; {user?.hospital || 'Healthcare Provider'}
                  </p>
                </div>
                <div className={`status-pill ${available ? 'status-pill--on' : 'status-pill--off'}`}>
                  <span className="status-dot" />
                  {available ? 'Available for consultations' : 'Currently unavailable'}
                </div>
              </div>

              {/* Stats */}
              <div className="grid-4">
                {STATS.map(s => (
                  <div key={s.label} className="stat-card">
                    <div className={`stat-icon ${s.color}`}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{s.icon}</span>
                    </div>
                    <div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Profile + Upcoming */}
              <div className="grid-2 mt-md">
                {/* Doctor Profile */}
                <div className="card">
                  <h3 className="section-title">Doctor Profile</h3>
                  <div className="profile-row">
                    <div className="avatar avatar-xl">{initials}</div>
                    <div className="profile-info">
                      <h2 style={{ color: 'var(--clr-text)', marginBottom: 4 }}>{user?.name}</h2>
                      <span className="badge badge-primary">{user?.specialization || 'Doctor'}</span>
                    </div>
                  </div>
                  <hr className="divider" />
                  <div className="profile-fields">
                    {[
                      { label: 'Email',       value: user?.email        || '—' },
                      { label: 'Phone',       value: user?.phone        || '—' },
                      { label: 'Hospital',    value: user?.hospital     || '—' },
                      { label: 'Location',    value: user?.location     || '—' },
                      { label: 'Specialization', value: user?.specialization || '—' },
                    ].map(f => (
                      <div key={f.label} className="profile-field">
                        <span className="profile-field__label">{f.label}</span>
                        <span className="profile-field__value">{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Schedule */}
                <div className="card">
                  <h3 className="section-title">Today's Schedule</h3>
                  <div className="consult-list">
                    {UPCOMING.map(u => (
                      <div key={u.id} className="consult-item">
                        <div className="consult-item__avatar">
                          {u.patient.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div className="consult-item__info">
                          <div className="consult-item__doctor">{u.patient}</div>
                          <div className="consult-item__spec">{u.spec}</div>
                          <div className="consult-item__time">{u.time} &bull; {u.mode}</div>
                        </div>
                        <button className="btn btn-primary btn-sm">Start</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pending Requests Preview */}
              <div className="card mt-md">
                <div className="flex-between mb-md">
                  <h3 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                    Pending Consultation Requests
                  </h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveSection('requests')}>
                    View All
                  </button>
                </div>
                {requests.slice(0, 2).map(r => (
                  <RequestCard key={r.id} req={r} onAccept={handleAccept} onDecline={handleDecline} />
                ))}
              </div>
            </>
          )}

          {/* Requests Section */}
          {activeSection === 'requests' && (
            <>
              <div className="dashboard-header">
                <h1 className="dashboard-title">Consultation Requests</h1>
                <span className="badge badge-warning" style={{ fontSize: '0.88rem', padding: '6px 14px' }}>
                  {requests.length} Pending
                </span>
              </div>
              {requests.length === 0 && (
                <div className="alert alert-success">No pending requests. All consultations are attended.</div>
              )}
              <div className="requests-list">
                {requests.map(r => (
                  <RequestCard key={r.id} req={r} onAccept={handleAccept} onDecline={handleDecline} />
                ))}
              </div>
            </>
          )}

          {/* Patient List */}
          {activeSection === 'patients' && !selectedPatient && (
            <>
              <div className="dashboard-header">
                <h1 className="dashboard-title">Patient List</h1>
                <div className="flex flex-gap-sm">
                  <input className="form-control" style={{ width: 200 }} placeholder="Search patients..." />
                </div>
              </div>
              <div className="card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Age / Gender</th>
                      <th>Condition</th>
                      <th>Last Visit</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PATIENTS.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="flex" style={{ alignItems: 'center', gap: 10 }}>
                            <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.78rem' }}>
                              {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                            </div>
                            <span className="fw-500">{p.name}</span>
                          </div>
                        </td>
                        <td className="text-muted text-sm">{p.age} / {p.gender}</td>
                        <td className="text-sm">{p.condition}</td>
                        <td className="text-muted text-sm">{p.lastVisit}</td>
                        <td>
                          <span className={`badge ${
                            p.status === 'critical' ? 'badge-danger' :
                            p.status === 'review'   ? 'badge-warning' : 'badge-success'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <button
                            id={`btn-view-patient-${p.id}`}
                            className="btn btn-primary btn-sm"
                            onClick={() => setSelectedPatient(p)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Patient Detail View */}
          {activeSection === 'patients' && selectedPatient && (
            <>
              <div className="dashboard-header">
                <div className="flex flex-gap-sm" style={{ alignItems: 'center' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedPatient(null)}>
                    &larr; Back
                  </button>
                  <h1 className="dashboard-title">{selectedPatient.name}</h1>
                </div>
              </div>
              <div className="grid-2">
                <div className="card">
                  <h3 className="section-title">Patient Information</h3>
                  <div className="profile-row">
                    <div className="avatar avatar-xl">
                      {selectedPatient.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h2 style={{ color: 'var(--clr-text)' }}>{selectedPatient.name}</h2>
                      <span className={`badge ${
                        selectedPatient.status === 'critical' ? 'badge-danger' :
                        selectedPatient.status === 'review'   ? 'badge-warning' : 'badge-success'
                      }`}>{selectedPatient.status}</span>
                    </div>
                  </div>
                  <hr className="divider" />
                  <div className="profile-fields">
                    {[
                      { label: 'Age',        value: selectedPatient.age    },
                      { label: 'Gender',     value: selectedPatient.gender },
                      { label: 'Condition',  value: selectedPatient.condition },
                      { label: 'Last Visit', value: selectedPatient.lastVisit },
                    ].map(f => (
                      <div key={f.label} className="profile-field">
                        <span className="profile-field__label">{f.label}</span>
                        <span className="profile-field__value">{f.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-gap-sm mt-md">
                    <button className="btn btn-primary btn-sm">Start Consultation</button>
                    <button className="btn btn-ghost btn-sm">Write Prescription</button>
                  </div>
                </div>
                <div className="card">
                  <h3 className="section-title">Medical Notes</h3>
                  <div className="alert alert-info">
                    Full patient medical history and AI-assisted notes will be available in Phase 2.
                  </div>
                  <textarea
                    className="form-control"
                    rows="6"
                    placeholder="Add clinical notes for this patient..."
                  />
                  <button className="btn btn-accent btn-sm mt-sm">Save Notes</button>
                </div>
              </div>
            </>
          )}

          {/* Schedule Section */}
          {activeSection === 'schedule' && (
            <>
              <div className="dashboard-header">
                <h1 className="dashboard-title">Schedule</h1>
              </div>
              <div className="alert alert-info">
                Full calendar scheduling will be integrated in Phase 2. Showing static upcoming sessions below.
              </div>
              <div className="card">
                <h3 className="section-title">Upcoming Sessions</h3>
                <div className="consult-list">
                  {UPCOMING.map(u => (
                    <div key={u.id} className="consult-item consult-item--lg">
                      <div className="consult-item__avatar">
                        {u.patient.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div className="consult-item__info">
                        <div className="consult-item__doctor">{u.patient}</div>
                        <div className="consult-item__spec">{u.spec}</div>
                        <div className="consult-item__time">{u.time} &bull; {u.mode}</div>
                      </div>
                      <div className="flex flex-col" style={{ gap: 6, alignItems: 'flex-end' }}>
                        <span className="badge badge-success">Confirmed</span>
                        <button className="btn btn-primary btn-sm">Start</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Request Card Sub-component ────────────────────────── */
function RequestCard({ req, onAccept, onDecline }) {
  return (
    <div className={`request-card ${req.urgent ? 'request-card--urgent' : ''}`}>
      <div className="request-card__header">
        <div className="flex" style={{ alignItems: 'center', gap: 10 }}>
          <div className="avatar">
            {req.patient.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="fw-600">{req.patient}</div>
            <div className="text-muted text-xs">{req.age} years &bull; {req.location}</div>
          </div>
        </div>
        <div className="flex" style={{ alignItems: 'center', gap: 8 }}>
          {req.urgent && <span className="badge badge-danger">Urgent</span>}
          <span className="text-muted text-xs">{req.time}</span>
        </div>
      </div>
      <p className="request-card__symptom">{req.symptom}</p>
      <div className="request-card__actions">
        <button
          id={`btn-accept-${req.id}`}
          className="btn btn-accent btn-sm"
          onClick={() => onAccept(req.id)}
        >
          Accept
        </button>
        <button
          id={`btn-decline-${req.id}`}
          className="btn btn-ghost btn-sm"
          onClick={() => onDecline(req.id)}
        >
          Decline
        </button>
        <button className="btn btn-primary btn-sm">View Full Details</button>
      </div>
    </div>
  );
}
