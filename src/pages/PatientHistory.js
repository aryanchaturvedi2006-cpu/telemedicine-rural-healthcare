import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import translations from '../translations/translations';
import { useLanguage } from '../context/LanguageContext';
import API_BASE_URL from '../config';

const PatientHistory = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key) => translations[language]?.[key] || translations['en'][key] || key;

  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data States
  const [appointments, setAppointments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Document UI States
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('Other Documents');
  const [searchDoc, setSearchDoc] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  // Profile UI States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    blood_group: '', allergies: '', emergency_contact: '', chronic_diseases: '', current_medicines: ''
  });
  
  // Vaccination UI States
  const [newVac, setNewVac] = useState({ name: '', date: '', dose: '' });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const patientDataStr = localStorage.getItem('currentPatient') || localStorage.getItem('patientData');
    const patientData = patientDataStr ? JSON.parse(patientDataStr) : null;
    if (!patientData || !patientData.id) {
      navigate('/patient-login');
      return;
    }
    setPatient(patientData);
    fetchAllData(patientData.id);
  }, [navigate]);

  const fetchAllData = async (patientId) => {
    setLoading(true);
    try {
      const [apptRes, docsRes, profRes, vacRes] = await Promise.all([
        fetch(`${API_BASE_URL || 'http://localhost:5001'}/api/appointments/patient/${patientId}`),
        fetch(`${API_BASE_URL || 'http://localhost:5001'}/api/vault/${patientId}/documents`),
        fetch(`${API_BASE_URL || 'http://localhost:5001'}/api/vault/${patientId}/emergency_profile`),
        fetch(`${API_BASE_URL || 'http://localhost:5001'}/api/vault/${patientId}/vaccinations`)
      ]);

      if (apptRes.ok) {
        const apptData = await apptRes.json();
        setAppointments((apptData.data || []).sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData.data || []);
      }
      if (profRes.ok) {
        const profData = await profRes.json();
        setProfile(profData.data || null);
        if (profData.data) setProfileForm(profData.data);
      }
      if (vacRes.ok) {
        const vacData = await vacRes.json();
        setVaccinations(vacData.data || []);
      }
    } catch (err) {
      console.error('Error fetching vault data:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Document Handlers ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('category', uploadCategory);

    try {
      const res = await fetch(`${API_BASE_URL || 'http://localhost:5001'}/api/vault/${patient.id}/documents`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        // Refresh docs
        const docsRes = await fetch(`${API_BASE_URL || 'http://localhost:5001'}/api/vault/${patient.id}/documents`);
        const docsData = await docsRes.json();
        setDocuments(docsData.data || []);
      }
    } catch (err) {
      console.error('Error uploading:', err);
    } finally {
      setUploading(false);
      e.target.value = null; // reset
    }
  };

  const deleteDocument = async (docId) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await fetch(`${API_BASE_URL || 'http://localhost:5001'}/api/vault/${patient.id}/documents/${docId}`, { method: 'DELETE' });
      setDocuments(documents.filter(d => d.id !== docId));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Profile Handlers ---
  const saveProfile = async () => {
    try {
      await fetch(`${API_BASE_URL || 'http://localhost:5001'}/api/vault/${patient.id}/emergency_profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      setProfile(profileForm);
      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Vaccination Handlers ---
  const addVaccination = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE_URL || 'http://localhost:5001'}/api/vault/${patient.id}/vaccinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVac)
      });
      setNewVac({ name: '', date: '', dose: '' });
      // Refresh Vacs
      const vacRes = await fetch(`${API_BASE_URL || 'http://localhost:5001'}/api/vault/${patient.id}/vaccinations`);
      const vacData = await vacRes.json();
      setVaccinations(vacData.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteVaccination = async (vid) => {
    if (!window.confirm("Delete vaccination record?")) return;
    try {
      await fetch(`${API_BASE_URL || 'http://localhost:5001'}/api/vault/${patient.id}/vaccinations/${vid}`, { method: 'DELETE' });
      setVaccinations(vaccinations.filter(v => v.id !== vid));
    } catch (err) {
      console.error(err);
    }
  };

  // Format Bytes
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalStorage = documents.reduce((acc, doc) => acc + doc.file_size, 0);
  const formatUrl = (path) => `${API_BASE_URL || 'http://localhost:5001'}${path}`;

  // Filter Docs
  const filteredDocs = documents.filter(d => {
    if (filterCategory !== 'All' && d.category !== filterCategory) return false;
    if (searchDoc && !d.name.toLowerCase().includes(searchDoc.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ background: '#F7FBF7', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#1F2937' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .vault-container { max-width: 1200px; margin: 0 auto; padding: 0 20px 60px 20px; }
        
        /* Top Navigation */
        .top-nav { background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.05); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 50; }
        .nav-logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 20px; color: #2E7D32; cursor: pointer; }
        
        /* Hero Banner */
        .vault-hero { background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%); border-radius: 20px; padding: 36px 48px; color: white; display: flex; justify-content: space-between; align-items: center; margin-top: 24px; box-shadow: 0 10px 30px rgba(46, 125, 50, 0.2); position: relative; overflow: hidden; }
        .vault-hero::after { content: ''; position: absolute; right: -50px; bottom: -50px; width: 250px; height: 250px; background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%); border-radius: 50%; pointer-events: none; }
        .hero-title { font-size: 32px; font-weight: 700; margin: 0 0 8px 0; display: flex; align-items: center; gap: 12px; }
        .hero-subtitle { font-size: 16px; color: #E8F5E9; margin: 0; opacity: 0.9; }
        .secure-badge { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; backdrop-filter: blur(4px); }
        
        /* Tabs */
        .vault-tabs { display: flex; gap: 12px; margin: 32px 0; overflow-x: auto; padding-bottom: 8px; }
        .tab-btn { background: #fff; border: 1px solid #E5E7EB; padding: 12px 24px; border-radius: 12px; font-size: 15px; font-weight: 600; color: #4B5563; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .tab-btn:hover { border-color: #2E7D32; color: #2E7D32; }
        .tab-btn.active { background: #2E7D32; color: #fff; border-color: #2E7D32; box-shadow: 0 4px 12px rgba(46,125,50,0.2); }
        
        /* Summary Grid */
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 32px; }
        .summary-card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #E5E7EB; box-shadow: 0 4px 15px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 12px; }
        .summary-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .summary-value { font-size: 28px; font-weight: 700; color: #111827; margin: 0; }
        .summary-label { font-size: 14px; color: #6B7280; font-weight: 500; margin: 0; }
        
        /* Upload Area */
        .upload-zone { background: #fff; border: 2px dashed #86EFAC; border-radius: 20px; padding: 48px 24px; text-align: center; transition: all 0.2s; cursor: pointer; margin-bottom: 32px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .upload-zone:hover { background: #F0FDF4; border-color: #2E7D32; }
        .upload-icon { font-size: 48px; color: #2E7D32; }
        
        /* Documents Grid */
        .docs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .doc-card { background: #fff; border-radius: 16px; border: 1px solid #E5E7EB; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s; }
        .doc-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-color: #2E7D32; }
        .doc-thumbnail { height: 120px; background: #F3F4F6; display: flex; align-items: center; justify-content: center; font-size: 48px; border-bottom: 1px solid #E5E7EB; }
        .doc-info { padding: 16px; flex: 1; }
        .doc-title { font-weight: 600; color: #1F2937; margin: 0 0 4px 0; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .doc-meta { font-size: 13px; color: #6B7280; margin: 0 0 16px 0; }
        .doc-actions { display: flex; gap: 8px; }
        .doc-btn { flex: 1; padding: 8px; border-radius: 8px; font-size: 13px; font-weight: 600; text-align: center; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
        .btn-preview { background: #F0FDF4; color: #2E7D32; }
        .btn-preview:hover { background: #DCFCE7; }
        .btn-delete { background: #FEF2F2; color: #DC2626; border-color: #FECACA; }
        .btn-delete:hover { background: #FEE2E2; }
        
        /* Timeline */
        .timeline { position: relative; padding-left: 32px; margin-top: 24px; }
        .timeline::before { content: ''; position: absolute; left: 11px; top: 0; bottom: 0; width: 2px; background: #E5E7EB; }
        .timeline-item { position: relative; margin-bottom: 32px; }
        .timeline-dot { position: absolute; left: -32px; top: 4px; width: 24px; height: 24px; border-radius: 50%; background: #2E7D32; border: 4px solid #F7FBF7; box-shadow: 0 0 0 2px #E5E7EB; }
        .timeline-content { background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        
        /* Profile Forms */
        .profile-card { background: #fff; border-radius: 20px; padding: 32px; border: 1px solid #E5E7EB; box-shadow: 0 4px 15px rgba(0,0,0,0.02); margin-bottom: 24px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-label { font-size: 14px; font-weight: 600; color: #374151; }
        .form-input { padding: 12px 16px; border-radius: 12px; border: 1px solid #D1D5DB; font-size: 15px; background: #F9FAFB; transition: border 0.2s; }
        .form-input:focus { border-color: #2E7D32; outline: none; background: #fff; }
        
        @media (max-width: 768px) {
          .vault-hero { padding: 24px; flex-direction: column; align-items: flex-start; gap: 16px; }
          .hero-title { font-size: 24px; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* TOP NAV */}
      <nav className="top-nav">
        <div className="nav-logo" onClick={() => navigate('/patient-dashboard')}>
          🌿 JeevanJyoti
        </div>
        <button 
          onClick={() => navigate('/patient-dashboard')}
          style={{ background: '#fff', color: '#2E7D32', border: '1.5px solid #2E7D32', padding: '8px 16px', borderRadius: '20px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
        >
          ← Back to Dashboard
        </button>
      </nav>

      <div className="vault-container">
        {/* HERO SECTION */}
        <div className="vault-hero">
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="hero-title">🛡️ My Health Vault</h1>
            <p className="hero-subtitle">Securely store and manage all your medical records in one place.</p>
          </div>
          <div className="secure-badge">
            🔒 Secure & Encrypted
          </div>
        </div>

        {/* TABS */}
        <div className="vault-tabs">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📊 Overview</button>
          <button className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>📄 Documents</button>
          <button className={`tab-btn ${activeTab === 'consultations' ? 'active' : ''}`} onClick={() => setActiveTab('consultations')}>👨‍⚕️ Consultations</button>
          <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>🏥 Medical Profile</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#6B7280' }}>Loading your secure vault...</div>
        ) : (
          <>
            {/* ===================== OVERVIEW TAB ===================== */}
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Health Summary</h2>
                <div className="summary-grid">
                  <div className="summary-card">
                    <div className="summary-icon" style={{ background: '#E0F2FE', color: '#0284C7' }}>📄</div>
                    <div>
                      <h3 className="summary-value">{documents.length}</h3>
                      <p className="summary-label">Total Documents</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon" style={{ background: '#F0FDF4', color: '#16A34A' }}>💊</div>
                    <div>
                      <h3 className="summary-value">{documents.filter(d => d.category === 'Prescriptions').length}</h3>
                      <p className="summary-label">Prescriptions</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>🧪</div>
                    <div>
                      <h3 className="summary-value">{documents.filter(d => d.category === 'Lab Reports').length}</h3>
                      <p className="summary-label">Lab Reports</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon" style={{ background: '#F3E8FF', color: '#9333EA' }}>👨‍⚕️</div>
                    <div>
                      <h3 className="summary-value">{appointments.length}</h3>
                      <p className="summary-label">Consultations</p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Emergency Summary */}
                  <div className="profile-card" style={{ marginBottom: 0 }}>
                    <h3 style={{ fontSize: '18px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🚨 Emergency ID
                    </h3>
                    {profile ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div><strong style={{ color: '#4B5563' }}>Blood Group:</strong> <span style={{ color: '#DC2626', fontWeight: 'bold' }}>{profile.blood_group || 'Not set'}</span></div>
                        <div><strong style={{ color: '#4B5563' }}>Allergies:</strong> {profile.allergies || 'None'}</div>
                        <div><strong style={{ color: '#4B5563' }}>Emergency Contact:</strong> {profile.emergency_contact || 'Not set'}</div>
                      </div>
                    ) : (
                      <p style={{ color: '#6B7280', margin: 0 }}>No emergency profile set. Go to Medical Profile to set it up.</p>
                    )}
                  </div>
                  
                  {/* Storage Status */}
                  <div className="profile-card" style={{ marginBottom: 0 }}>
                    <h3 style={{ fontSize: '18px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      💾 Storage Usage
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#2E7D32', lineHeight: 1 }}>{formatBytes(totalStorage)}</span>
                      <span style={{ color: '#6B7280', paddingBottom: '4px' }}>used</span>
                    </div>
                    <div style={{ height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '15%', height: '100%', background: '#2E7D32' }}></div>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '12px' }}>Your records are securely backed up in the cloud.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ===================== DOCUMENTS TAB ===================== */}
            {activeTab === 'documents' && (
              <div>
                {/* Upload Zone */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                  onChange={handleFileUpload}
                />
                <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                  <div className="upload-icon">☁️</div>
                  <div>
                    <h3 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>{uploading ? 'Uploading...' : 'Upload Medical Document'}</h3>
                    <p style={{ color: '#6B7280', margin: 0 }}>Click or drag files here (PDF, JPG, PNG, DOCX)</p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }} onClick={(e) => e.stopPropagation()}>
                    <select 
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                    >
                      <option>Prescriptions</option>
                      <option>Lab Reports</option>
                      <option>Medical Images</option>
                      <option>Doctor Notes</option>
                      <option>Other Documents</option>
                    </select>
                    <button 
                      onClick={() => fileInputRef.current.click()}
                      style={{ background: '#2E7D32', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Browse Files
                    </button>
                  </div>
                </div>

                {/* Filters & Search */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {['All', 'Prescriptions', 'Lab Reports', 'Medical Images', 'Other Documents'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        style={{ 
                          padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none',
                          background: filterCategory === cat ? '#2E7D32' : '#E5E7EB',
                          color: filterCategory === cat ? '#fff' : '#4B5563'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search documents..." 
                    value={searchDoc}
                    onChange={(e) => setSearchDoc(e.target.value)}
                    style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid #D1D5DB', width: '250px', outline: 'none' }}
                  />
                </div>

                {/* Documents Grid */}
                {filteredDocs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '64px 20px', background: '#fff', borderRadius: '20px', border: '1px dashed #D1D5DB' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>📂</div>
                    <h3 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>No medical records found</h3>
                    <p style={{ color: '#6B7280', margin: 0 }}>Upload prescriptions, reports and medical documents to keep everything securely organized.</p>
                  </div>
                ) : (
                  <div className="docs-grid">
                    {filteredDocs.map(doc => {
                      const isPdf = doc.file_path.toLowerCase().endsWith('.pdf');
                      const fileUrl = formatUrl(doc.file_path);
                      return (
                        <div key={doc.id} className="doc-card">
                          <div className="doc-thumbnail">
                            {isPdf ? '📄' : '🖼️'}
                          </div>
                          <div className="doc-info">
                            <h4 className="doc-title" title={doc.name}>{doc.name}</h4>
                            <p className="doc-meta">{doc.category} • {formatBytes(doc.file_size)}</p>
                            <div className="doc-actions">
                              <a href={fileUrl} target="_blank" rel="noreferrer" className="doc-btn btn-preview">Preview</a>
                              <a href={fileUrl} download className="doc-btn btn-preview" style={{ background: '#E0F2FE', color: '#0369A1' }}>Download</a>
                              <button onClick={() => deleteDocument(doc.id)} className="doc-btn btn-delete">Delete</button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ===================== CONSULTATIONS TAB ===================== */}
            {activeTab === 'consultations' && (
              <div>
                <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Consultation History</h2>
                <p style={{ color: '#6B7280', marginBottom: '32px' }}>A complete timeline of your interactions with healthcare professionals.</p>

                {appointments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '64px 20px', background: '#fff', borderRadius: '20px', border: '1px dashed #D1D5DB' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏥</div>
                    <h3 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>No consultations yet</h3>
                    <p style={{ color: '#6B7280', margin: 0 }}>Book your first consultation from the dashboard.</p>
                  </div>
                ) : (
                  <div className="timeline">
                    {appointments.map(appt => (
                      <div key={appt.id} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
                            <div>
                              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>👨‍⚕️ {appt.doctor_name || 'Doctor'}</h3>
                              <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>{appt.specialization} • {appt.hospital_name}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ 
                                padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize',
                                background: appt.status === 'completed' ? '#DCFCE7' : '#FEF3C7',
                                color: appt.status === 'completed' ? '#166534' : '#B45309'
                              }}>
                                {appt.status}
                              </span>
                              <p style={{ margin: '8px 0 0 0', fontSize: '14px', fontWeight: '600' }}>{appt.date}</p>
                            </div>
                          </div>

                          <div style={{ marginBottom: '16px' }}>
                            <strong style={{ fontSize: '14px', color: '#4B5563' }}>Symptoms:</strong>
                            <p style={{ margin: '4px 0 0 0', color: '#1F2937', fontSize: '15px' }}>{appt.symptoms}</p>
                          </div>

                          {(appt.medicines || appt.prescription_text) && (
                            <div style={{ background: '#F0FDF4', padding: '16px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                              {appt.medicines && (
                                <div style={{ marginBottom: appt.prescription_text ? '12px' : '0' }}>
                                  <strong style={{ color: '#166534', fontSize: '14px' }}>💊 Medicines Prescribed:</strong>
                                  <p style={{ margin: '4px 0 0 0', color: '#15803D', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{appt.medicines}</p>
                                </div>
                              )}
                              {appt.prescription_text && (
                                <div>
                                  <strong style={{ color: '#166534', fontSize: '14px' }}>📝 Doctor Notes:</strong>
                                  <p style={{ margin: '4px 0 0 0', color: '#15803D', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{appt.prescription_text}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===================== MEDICAL PROFILE TAB ===================== */}
            {activeTab === 'profile' && (
              <div>
                {/* Emergency Profile */}
                <div className="profile-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '20px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>🚨 Emergency Medical Profile</h2>
                    {!isEditingProfile ? (
                      <button onClick={() => setIsEditingProfile(true)} style={{ background: '#F3F4F6', color: '#374151', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Edit Profile</button>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setIsEditingProfile(false)} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={saveProfile} style={{ background: '#2E7D32', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Save Changes</button>
                      </div>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Blood Group</label>
                        <select className="form-input" value={profileForm.blood_group || ''} onChange={e => setProfileForm({...profileForm, blood_group: e.target.value})}>
                          <option value="">Select...</option>
                          <option value="A+">A+</option><option value="A-">A-</option>
                          <option value="B+">B+</option><option value="B-">B-</option>
                          <option value="O+">O+</option><option value="O-">O-</option>
                          <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Emergency Contact (Phone)</label>
                        <input className="form-input" type="text" value={profileForm.emergency_contact || ''} onChange={e => setProfileForm({...profileForm, emergency_contact: e.target.value})} placeholder="e.g. +91 9876543210" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Allergies</label>
                        <input className="form-input" type="text" value={profileForm.allergies || ''} onChange={e => setProfileForm({...profileForm, allergies: e.target.value})} placeholder="e.g. Penicillin, Peanuts (or None)" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Chronic Diseases</label>
                        <input className="form-input" type="text" value={profileForm.chronic_diseases || ''} onChange={e => setProfileForm({...profileForm, chronic_diseases: e.target.value})} placeholder="e.g. Diabetes, Hypertension" />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Current Ongoing Medicines</label>
                        <textarea className="form-input" value={profileForm.current_medicines || ''} onChange={e => setProfileForm({...profileForm, current_medicines: e.target.value})} placeholder="List any medicines you take daily..." rows="3"></textarea>
                      </div>
                    </div>
                  ) : (
                    <div className="form-grid" style={{ background: '#F9FAFB', padding: '24px', borderRadius: '16px', border: '1px dashed #D1D5DB' }}>
                      <div><strong style={{ color: '#6B7280', display: 'block', marginBottom: '4px' }}>Blood Group</strong><span style={{ fontSize: '18px', fontWeight: 'bold', color: '#DC2626' }}>{profile?.blood_group || 'Not set'}</span></div>
                      <div><strong style={{ color: '#6B7280', display: 'block', marginBottom: '4px' }}>Emergency Contact</strong><span style={{ fontSize: '16px', fontWeight: '500' }}>{profile?.emergency_contact || 'Not set'}</span></div>
                      <div><strong style={{ color: '#6B7280', display: 'block', marginBottom: '4px' }}>Allergies</strong><span style={{ fontSize: '16px' }}>{profile?.allergies || 'None'}</span></div>
                      <div><strong style={{ color: '#6B7280', display: 'block', marginBottom: '4px' }}>Chronic Diseases</strong><span style={{ fontSize: '16px' }}>{profile?.chronic_diseases || 'None'}</span></div>
                      <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6B7280', display: 'block', marginBottom: '4px' }}>Current Medicines</strong><span style={{ fontSize: '16px' }}>{profile?.current_medicines || 'None'}</span></div>
                    </div>
                  )}
                </div>

                {/* Vaccinations */}
                <div className="profile-card">
                  <h2 style={{ fontSize: '20px', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>💉 Vaccination Records</h2>
                  
                  <form onSubmit={addVaccination} style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                    <input required className="form-input" style={{ flex: 2 }} type="text" placeholder="Vaccine Name (e.g. COVID-19)" value={newVac.name} onChange={e => setNewVac({...newVac, name: e.target.value})} />
                    <input required className="form-input" style={{ flex: 1 }} type="date" value={newVac.date} onChange={e => setNewVac({...newVac, date: e.target.value})} />
                    <input required className="form-input" style={{ flex: 1 }} type="text" placeholder="Dose (e.g. 1st, Booster)" value={newVac.dose} onChange={e => setNewVac({...newVac, dose: e.target.value})} />
                    <button type="submit" style={{ background: '#2E7D32', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>Add Record</button>
                  </form>

                  {vaccinations.length === 0 ? (
                    <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>No vaccination records added yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {vaccinations.map(vac => (
                        <div key={vac.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                          <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{vac.name}</h4>
                            <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>Date: {vac.date} • Dose: {vac.dose}</p>
                          </div>
                          <button onClick={() => deleteVaccination(vac.id)} style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '20px' }}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;
