import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import API_BASE_URL from '../config';
import './TeleMedGlobal.css';

// Premium Theme Colors matching Landing Page
const THEME = {
  primary: '#1B5E20', // Dark Green
  secondary: '#2E7D32', // Medium Green
  accent: '#F59E0B', // Amber/Yellow
  background: '#F9FBF9', // Soft Mint/White
  surface: '#FFFFFF', // Pure White
  text: '#1A1A1A',
  textLight: '#555555',
  border: '#C8E6C9'
};

const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Security State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Change Password State
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem('adminPassword') || 'admin123';
    if (passcode === savedPassword) {
      setIsAuthenticated(true);
      setAuthError('');
      setPasscode(''); // clear field
    } else {
      setAuthError('Incorrect passcode. Access Denied.');
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      alert("Password must be at least 4 characters long!");
      return;
    }
    localStorage.setItem('adminPassword', newPassword);
    alert("Password changed successfully!");
    setNewPassword('');
    setShowChangePassword(false);
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/analytics`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data.data);
      } else {
        setError('Failed to fetch analytics');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: THEME.background, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        fontFamily: 'system-ui, Arial, sans-serif'
      }}>
        <div style={{
          background: THEME.surface,
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(27, 94, 32, 0.1)',
          border: `1px solid ${THEME.border}`,
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ color: THEME.primary, margin: '0 0 8px 0', fontSize: '24px' }}>Admin Access</h2>
          <p style={{ color: THEME.textLight, fontSize: '14px', marginBottom: '24px' }}>
            Restricted area. Only authorized creators can access this dashboard.
          </p>
          
          <form onSubmit={handleLogin}>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Enter Admin Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                style={{
                  width: '100%', padding: '14px', borderRadius: '8px', border: `2px solid ${THEME.border}`,
                  fontSize: '16px', boxSizing: 'border-box', outline: 'none',
                  textAlign: 'center', letterSpacing: '2px'
                }}
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                  cursor: 'pointer', fontSize: '20px'
                }}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </span>
            </div>
            {authError && <p style={{ color: '#C62828', fontSize: '13px', margin: '0 0 16px 0', fontWeight: 'bold' }}>{authError}</p>}
            
            <button type="submit" style={{
              width: '100%', padding: '14px', backgroundColor: THEME.primary, color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(27, 94, 32, 0.2)'
            }}>
              Unlock Dashboard
            </button>
            
            <button type="button" onClick={() => navigate('/')} style={{
              width: '100%', padding: '14px', backgroundColor: 'transparent', color: THEME.textLight,
              border: 'none', fontSize: '14px', cursor: 'pointer', marginTop: '8px'
            }}>
              ← Back to Home
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LOADING / ERROR SCREENS
  // ----------------------------------------------------
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.background }}>
        <h2 style={{ color: THEME.primary, fontFamily: 'system-ui, sans-serif' }}>Loading Analytics... ⏳</h2>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.background }}>
        <h2 style={{ color: '#C62828', fontFamily: 'system-ui, sans-serif' }}>Error: {error}</h2>
      </div>
    );
  }

  // ----------------------------------------------------
  // DASHBOARD RENDER
  // ----------------------------------------------------
  const { totals, appointmentStatus, genderDistribution, stateDistribution, diseaseDistribution } = analytics;

  // Format data for charts
  const statusData = appointmentStatus.map(item => ({ name: item.status, count: item.count }));
  const genderData = genderDistribution.map(item => ({ name: item.gender, count: item.count }));
  const stateData = stateDistribution.map(item => ({ name: item.state, count: item.count }));

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: THEME.background, 
      padding: '40px 20px',
      fontFamily: 'system-ui, Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px',
          background: THEME.surface, padding: '20px 30px', borderRadius: '16px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: `1px solid ${THEME.border}`
        }}>
          <div>
            <h1 style={{ color: THEME.primary, margin: 0, fontSize: '28px', fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>
              JeevanJyoti <span style={{ color: THEME.accent, fontFamily: 'system-ui, sans-serif' }}>Analytics</span>
            </h1>
            <p style={{ margin: '4px 0 0 0', color: THEME.textLight, fontSize: '14px' }}>Real-time telemedicine deployment insights</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setShowChangePassword(!showChangePassword)}
              style={{ 
                padding: '12px 20px', backgroundColor: '#f1f8f1', color: THEME.primary, 
                border: `1px solid ${THEME.primary}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              ⚙️ Settings
            </button>
            <button 
              onClick={() => { setIsAuthenticated(false); navigate('/'); }}
              style={{ 
                padding: '12px 24px', backgroundColor: '#C62828', color: 'white', 
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(198, 40, 40, 0.2)'
              }}
            >
              Lock & Exit
            </button>
          </div>
        </div>

        {/* Change Password Modal / Section */}
        {showChangePassword && (
          <div style={{
            background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '30px',
            border: `1px solid ${THEME.border}`, display: 'flex', alignItems: 'center', gap: '15px'
          }}>
            <h4 style={{ margin: 0, color: THEME.primary }}>Update Admin Passcode:</h4>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', gap: '10px', flex: 1 }}>
              <input 
                type="password" 
                placeholder="Enter new passcode"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1, maxWidth: '300px' }}
                required
              />
              <button type="submit" style={{ padding: '10px 20px', background: THEME.accent, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                Save Password
              </button>
            </form>
          </div>
        )}

        {/* Top Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <StatCard title="Total Registered Patients" count={totals.patients} icon="👥" color={THEME.primary} />
          <StatCard title="Verified Doctors" count={totals.doctors} icon="👨‍⚕️" color={THEME.accent} />
          <StatCard title="Total Consultations" count={totals.appointments} icon="📅" color="#1976D2" />
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
          
          {/* Disease Distribution Chart */}
          <ChartCard title="Disease Outbreak Trends" subtitle="Most common symptoms reported">
            {diseaseDistribution && diseaseDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={diseaseDistribution.slice(0, 5)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: THEME.textLight, fontSize: 12}} interval={0} angle={-30} textAnchor="end" />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: THEME.textLight}} />
                  <Tooltip cursor={{fill: THEME.background}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill={THEME.accent} radius={[4, 4, 0, 0]} name="No. of Cases" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No disease data available yet" />
            )}
          </ChartCard>

          {/* Appointment Status Chart */}
          <ChartCard title="Telemedicine Load Status" subtitle="Pending vs Confirmed vs Completed">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: THEME.textLight}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: THEME.textLight}} />
                <Tooltip cursor={{fill: THEME.background}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill={THEME.primary} radius={[4, 4, 0, 0]} name="Appointments" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Gender Distribution Pie Chart */}
          <ChartCard title="Patient Demographics" subtitle="Gender distribution across rural areas">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={genderData} cx="50%" cy="50%" 
                  labelLine={false} 
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`} 
                  outerRadius={100} 
                  innerRadius={60}
                  dataKey="count"
                  paddingAngle={5}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* State Distribution Chart */}
          <ChartCard title="Deployment Reach" subtitle="Patients distributed by state">
            {stateData && stateData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stateData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E0E0E0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: THEME.textLight}} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: THEME.textLight, fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: THEME.background}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#1976D2" radius={[0, 4, 4, 0]} name="Patients" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No location data available yet" />
            )}
          </ChartCard>

        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const StatCard = ({ title, count, color, icon }) => (
  <div style={{ 
    backgroundColor: THEME.surface, 
    padding: '24px', 
    borderRadius: '16px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${THEME.border}`,
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ 
      position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', backgroundColor: color 
    }}></div>
    <div style={{ 
      fontSize: '36px', 
      marginRight: '20px',
      background: `${color}15`, // very light tint of the color
      width: '60px', height: '60px',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      borderRadius: '12px'
    }}>
      {icon}
    </div>
    <div>
      <h4 style={{ margin: '0 0 4px 0', color: THEME.textLight, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </h4>
      <h2 style={{ margin: 0, color: THEME.text, fontSize: '32px', fontWeight: '900' }}>
        {count}
      </h2>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children }) => (
  <div style={{ 
    backgroundColor: THEME.surface, 
    padding: '24px', 
    borderRadius: '16px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    border: `1px solid ${THEME.border}`
  }}>
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ color: THEME.primary, margin: '0 0 4px 0', fontSize: '18px' }}>{title}</h3>
      <p style={{ color: THEME.textLight, margin: 0, fontSize: '13px' }}>{subtitle}</p>
    </div>
    {children}
  </div>
);

const EmptyState = ({ message }) => (
  <div style={{ 
    height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center',
    color: '#9E9E9E', fontStyle: 'italic', backgroundColor: '#F9FBF9', borderRadius: '12px',
    border: '1px dashed #E0E0E0'
  }}>
    {message}
  </div>
);

export default AdminDashboard;
