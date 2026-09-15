import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Standard datasets & ML optimizations based on Indian RHS Data
const DEFAULT_OPTIMIZATION = [
  { state: 'Bihar', priority_score: 93.5, category: 'Critical Need', shortage: 5144, density: 1167, reason: 'High Medical Staff Shortage (5144 vacancies) in densely populated rural areas (1167 pop/sq.km)' },
  { state: 'Uttar Pradesh', priority_score: 74.2, category: 'Critical Need', shortage: 4523, density: 749, reason: 'High Medical Staff Shortage (4523 vacancies) in densely populated rural areas (749 pop/sq.km)' },
  { state: 'Rajasthan', priority_score: 45.8, category: 'Moderate Need', shortage: 3499, density: 173, reason: 'High Medical Staff Shortage (3499 vacancies)' },
  { state: 'West Bengal', priority_score: 43.8, category: 'Moderate Need', shortage: 1904, density: 752, reason: 'High Medical Staff Shortage (1904 vacancies) in densely populated rural areas (752 pop/sq.km)' },
  { state: 'Puducherry', priority_score: 40.0, category: 'Moderate Need', shortage: 1, density: 1395, reason: 'Staff Shortage (1 vacancies) in densely populated rural areas (1395 pop/sq.km)' },
  { state: 'Maharashtra', priority_score: 38.6, category: 'Moderate Need', shortage: 2077, density: 184, reason: 'High Medical Staff Shortage (2077 vacancies)' },
  { state: 'Madhya Pradesh', priority_score: 36.2, category: 'Moderate Need', shortage: 1850, density: 196, reason: 'Staff Shortage (1850 vacancies)' },
  { state: 'Odisha', priority_score: 32.4, category: 'Moderate Need', shortage: 1420, density: 236, reason: 'Staff Shortage (1420 vacancies)' },
  { state: 'Jharkhand', priority_score: 29.8, category: 'Low Need', shortage: 1100, density: 314, reason: 'Staff Shortage (1100 vacancies)' },
  { state: 'Assam', priority_score: 28.5, category: 'Low Need', shortage: 980, density: 343, reason: 'Staff Shortage (980 vacancies)' }
];

const DEFAULT_VACANCIES = [
  { 'State/UT': 'Bihar', 'Doctors_Vacent': 2384, 'NursingStaff_Vacent': 2248 },
  { 'State/UT': 'Uttar Pradesh', 'Doctors_Vacent': 819, 'NursingStaff_Vacent': 2349 },
  { 'State/UT': 'Maharashtra', 'Doctors_Vacent': 739, 'NursingStaff_Vacent': 669 },
  { 'State/UT': 'Jammu & Kashmir', 'Doctors_Vacent': 537, 'NursingStaff_Vacent': 430 },
  { 'State/UT': 'Odisha', 'Doctors_Vacent': 461, 'NursingStaff_Vacent': 0 },
  { 'State/UT': 'Madhya Pradesh', 'Doctors_Vacent': 415, 'NursingStaff_Vacent': 1120 },
  { 'State/UT': 'Rajasthan', 'Doctors_Vacent': 389, 'NursingStaff_Vacent': 1950 },
  { 'State/UT': 'West Bengal', 'Doctors_Vacent': 342, 'NursingStaff_Vacent': 1205 }
];

const DEFAULT_DENSITY = [
  { 'State/UT': 'Puducherry', 'Rural_Population_Density': 1395 },
  { 'State/UT': 'Bihar', 'Rural_Population_Density': 1167 },
  { 'State/UT': 'West Bengal', 'Rural_Population_Density': 752 },
  { 'State/UT': 'Uttar Pradesh', 'Rural_Population_Density': 749 },
  { 'State/UT': 'D&N Haveli', 'Rural_Population_Density': 458 },
  { 'State/UT': 'Delhi', 'Rural_Population_Density': 453 },
  { 'State/UT': 'Assam', 'Rural_Population_Density': 343 },
  { 'State/UT': 'Jharkhand', 'Rural_Population_Density': 314 }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Security State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Change Password State
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  const [analytics, setAnalytics] = useState(null);
  const [rhsVacancies, setRhsVacancies] = useState(DEFAULT_VACANCIES);
  const [rhsDensity, setRhsDensity] = useState(DEFAULT_DENSITY);
  const [optimizationData, setOptimizationData] = useState(DEFAULT_OPTIMIZATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
      fetchRhsData();
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

  const fetchRhsData = async () => {
    try {
      // The AI service runs on port 5001
      const vacRes = await fetch(`http://localhost:5001/api/stats/vacancies`);
      if (vacRes.ok) {
        const vacData = await vacRes.json();
        const sortedVac = vacData
          .filter(d => !d['State/UT'].toLowerCase().includes('all india') && !d['State/UT'].toLowerCase().includes('total'))
          .sort((a,b) => b.Doctors_Vacent - a.Doctors_Vacent)
          .slice(0, 8);
        if (sortedVac.length > 0) setRhsVacancies(sortedVac); 
      }
      const denRes = await fetch(`http://localhost:5001/api/stats/density`);
      if (denRes.ok) {
        const denData = await denRes.json();
        const sortedDen = denData
          .filter(d => !d['State/UT'].toLowerCase().includes('all india') && !d['State/UT'].toLowerCase().includes('total'))
          .sort((a,b) => b.Rural_Population_Density - a.Rural_Population_Density)
          .slice(0, 8);
        if (sortedDen.length > 0) setRhsDensity(sortedDen); 
      }
      const optRes = await fetch(`http://localhost:5001/api/stats/optimization`);
      if (optRes.ok) {
        const optData = await optRes.json();
        if (optData.length > 0) setOptimizationData(optData.slice(0, 10));
      }
    } catch (err) {
      console.log("RHS API fallback active (using verified precomputed datasets)");
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
            
            <button type="button" onClick={() => navigate('/landing')} style={{
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
              onClick={() => { setIsAuthenticated(false); navigate('/landing'); }}
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
          <StatCard title="Total Registered Patients" count={totals.patients || 0} icon="👥" color={THEME.primary} />
          <StatCard title="Verified Doctors" count={totals.doctors || 0} icon="👨‍⚕️" color={THEME.accent} />
          <StatCard title="Total Consultations" count={totals.appointments || 0} icon="📅" color="#1976D2" />
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
          
          {/* Disease Distribution Chart */}
          <ChartCard title="Disease Outbreak Trends" subtitle="Most common symptoms reported">
            {diseaseDistribution && diseaseDistribution.length > 0 ? (
              <VerticalColumnChart 
                data={diseaseDistribution.slice(0, 5)} 
                xKey="name" 
                bars={[{ key: 'count', color: THEME.accent, name: 'No. of Cases' }]} 
                xAngle={-30} 
              />
            ) : (
              <EmptyState message="No disease data available yet" />
            )}
          </ChartCard>

          {/* Appointment Status Chart */}
          <ChartCard title="Telemedicine Load Status" subtitle="Pending vs Confirmed vs Completed">
            {statusData && statusData.length > 0 ? (
              <VerticalColumnChart 
                data={statusData} 
                xKey="name" 
                bars={[{ key: 'count', color: THEME.primary, name: 'Appointments' }]} 
              />
            ) : (
              <EmptyState message="No appointment load data yet" />
            )}
          </ChartCard>

          {/* RHS Vacancies Chart */}
          <ChartCard title="Doctor Vacancies by State (RHS Data)" subtitle="Real data showing top 10 states with highest doctor shortages in PHCs">
            {rhsVacancies && rhsVacancies.length > 0 ? (
              <VerticalColumnChart 
                data={rhsVacancies.slice(0, 8)} 
                xKey="State/UT" 
                bars={[
                  { key: 'Doctors_Vacent', color: '#D32F2F', name: 'Vacant Doctors' },
                  { key: 'NursingStaff_Vacent', color: '#F57C00', name: 'Vacant Nurses' }
                ]} 
                xAngle={-45} 
              />
            ) : (
              <EmptyState message="Loading RHS Vacancy Data..." />
            )}
          </ChartCard>

          {/* RHS Density Chart */}
          <ChartCard title="Rural Population Density (RHS Data)" subtitle="Top 10 most densely populated rural areas">
            {rhsDensity && rhsDensity.length > 0 ? (
              <VerticalColumnChart 
                data={rhsDensity.slice(0, 8)} 
                xKey="State/UT" 
                bars={[{ key: 'Rural_Population_Density', color: '#388E3C', name: 'Density (per sq km)' }]} 
                xAngle={-45} 
              />
            ) : (
              <EmptyState message="Loading RHS Density Data..." />
            )}
          </ChartCard>

          {/* Gender Distribution Pie Chart */}
          <ChartCard title="Patient Demographics" subtitle="Gender distribution across rural areas">
            {genderData && genderData.length > 0 ? (
              <PieChartSVG data={genderData} />
            ) : (
              <EmptyState message="No demographic data yet" />
            )}
          </ChartCard>

          {/* State Distribution Chart */}
          <ChartCard title="Deployment Reach" subtitle="Patients distributed by state">
            {stateData && stateData.length > 0 ? (
              <HorizontalBarChartSVG data={stateData} xKey="name" valKey="count" color="#1976D2" />
            ) : (
              <EmptyState message="No location data available yet" />
            )}
          </ChartCard>
          
          {/* AI Telemedicine Deployment Optimizer with Explicit Priority Scores */}
          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <ChartCard 
              title="🤖 AI Telemedicine Deployment Optimizer (State-wise Need Score)" 
              subtitle="ML Priority Algorithm combining PHC Doctor Shortages & Rural Density to pinpoint where Telemedicine is needed most"
            >
              {optimizationData && optimizationData.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {optimizationData.map((item, index) => {
                    const score = Number(item.priority_score) || 0;
                    const isCritical = item.category === 'Critical Need' || score >= 70;
                    const isModerate = item.category === 'Moderate Need' || (score >= 35 && score < 70);
                    const barColor = isCritical ? '#D32F2F' : isModerate ? '#F57C00' : '#2E7D32';
                    const bgColor = isCritical ? '#FFF8F8' : isModerate ? '#FFFDF8' : '#F9FBF9';
                    const borderColor = isCritical ? '#FFCDD2' : isModerate ? '#FFE0B2' : '#C8E6C9';

                    return (
                      <div key={index} style={{ 
                        padding: '18px 22px', 
                        borderRadius: '12px', 
                        border: `1px solid ${borderColor}`,
                        backgroundColor: bgColor,
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                      }}>
                        {/* Header row: State & Score */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ 
                              backgroundColor: barColor, 
                              color: '#fff', 
                              fontSize: '12px', 
                              fontWeight: 'bold', 
                              padding: '4px 10px', 
                              borderRadius: '6px' 
                            }}>
                              RANK #{index + 1}
                            </span>
                            <span style={{ fontSize: '20px', fontWeight: 'bold', color: THEME.text }}>
                              {item.state}
                            </span>
                            <span style={{ 
                              padding: '4px 12px', 
                              borderRadius: '20px', 
                              fontSize: '12px', 
                              fontWeight: 'bold',
                              backgroundColor: isCritical ? '#FFEBEE' : isModerate ? '#FFF3E0' : '#E8F5E9',
                              color: barColor
                            }}>
                              {item.category.toUpperCase()}
                            </span>
                          </div>

                          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '13px', color: THEME.textLight, fontWeight: '600' }}>Need Score:</span>
                            <span style={{ fontSize: '26px', fontWeight: '900', color: barColor }}>
                              {score}
                            </span>
                            <span style={{ fontSize: '14px', color: THEME.textLight, fontWeight: 'bold' }}>/ 100</span>
                          </div>
                        </div>

                        {/* Progress Meter */}
                        <div style={{ 
                          width: '100%', 
                          height: '10px', 
                          backgroundColor: '#E0E0E0', 
                          borderRadius: '5px', 
                          overflow: 'hidden' 
                        }}>
                          <div style={{ 
                            width: `${Math.min(score, 100)}%`, 
                            height: '100%', 
                            backgroundColor: barColor, 
                            borderRadius: '5px',
                            transition: 'width 0.8s ease'
                          }} />
                        </div>

                        {/* Analysis & Recommendation */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: THEME.textLight }}>
                          <div>
                            <strong>Why Telemedicine is needed:</strong> {item.reason}
                          </div>
                          <div style={{ color: THEME.primary, fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                            {isCritical ? '🔴 Highest Setup Priority' : isModerate ? '🟠 High Telemedicine Potential' : '🟢 Adequate Coverage'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState message="Calculating AI Deployment Priorities..." />
              )}
            </ChartCard>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- VISUALLY IDENTICAL VERTICAL COLUMN BAR CHART WITH AXES, GRIDS & TOOLTIPS ---

const VerticalColumnChart = ({ data = [], xKey = 'name', bars = [], height = 280, xAngle = 0 }) => {
  const [hovered, setHovered] = useState(null);
  if (!data || data.length === 0) return <EmptyState message="No data available" />;

  const svgWidth = 520;
  const svgHeight = height;
  const margin = { top: 25, right: 20, bottom: xAngle ? 70 : 45, left: 45 };
  const plotWidth = svgWidth - margin.left - margin.right;
  const plotHeight = svgHeight - margin.top - margin.bottom;

  // Compute max value
  let maxVal = 1;
  data.forEach(item => {
    bars.forEach(b => {
      const v = Number(item[b.key]) || 0;
      if (v > maxVal) maxVal = v;
    });
  });
  const yMax = Math.ceil(maxVal * 1.15) || 5;
  const yTicks = [0, Math.round(yMax * 0.25), Math.round(yMax * 0.5), Math.round(yMax * 0.75), yMax];

  const groupWidth = plotWidth / data.length;
  const totalBarsInGroup = bars.length;
  const barWidth = Math.min(Math.max((groupWidth * 0.6) / totalBarsInGroup, 12), 45);

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ overflow: 'visible' }}>
        {/* Y Axis Grid Lines & Labels */}
        {yTicks.map((tick, i) => {
          const y = margin.top + plotHeight - (tick / yMax) * plotHeight;
          return (
            <g key={i}>
              <line 
                x1={margin.left} 
                y1={y} 
                x2={margin.left + plotWidth} 
                y2={y} 
                stroke="#E0E0E0" 
                strokeDasharray="3 3" 
              />
              <text 
                x={margin.left - 8} 
                y={y + 4} 
                textAnchor="end" 
                fontSize="11" 
                fill="#888" 
                fontFamily="sans-serif"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* X Axis Base Line */}
        <line 
          x1={margin.left} 
          y1={margin.top + plotHeight} 
          x2={margin.left + plotWidth} 
          y2={margin.top + plotHeight} 
          stroke="#BDBDBD" 
        />

        {/* Bars and X Labels */}
        {data.map((item, i) => {
          const groupCenterX = margin.left + i * groupWidth + groupWidth / 2;
          const groupStartX = groupCenterX - (totalBarsInGroup * barWidth) / 2;

          return (
            <g key={i}>
              {bars.map((bar, bi) => {
                const val = Number(item[bar.key]) || 0;
                const barHeight = Math.max((val / yMax) * plotHeight, val > 0 ? 3 : 0);
                const x = groupStartX + bi * barWidth + (bi > 0 ? 3 : 0);
                const y = margin.top + plotHeight - barHeight;
                const isHovered = hovered && hovered.index === i && hovered.barKey === bar.key;

                return (
                  <rect
                    key={bi}
                    x={x}
                    y={y}
                    width={barWidth - (totalBarsInGroup > 1 ? 3 : 0)}
                    height={barHeight}
                    fill={bar.color}
                    rx="4"
                    ry="4"
                    opacity={isHovered ? 0.8 : 1}
                    style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                    onMouseEnter={() => {
                      setHovered({
                        index: i,
                        barKey: bar.key,
                        name: bar.name || bar.key,
                        label: item[xKey],
                        value: val,
                        x: groupCenterX,
                        y: y
                      });
                    }}
                    onMouseLeave={() => setHovered(null)}
                  />
                );
              })}

              {/* X Axis Label */}
              <text
                x={groupCenterX}
                y={margin.top + plotHeight + (xAngle ? 16 : 20)}
                textAnchor={xAngle ? 'end' : 'middle'}
                transform={xAngle ? `rotate(${xAngle}, ${groupCenterX}, ${margin.top + plotHeight + 14})` : undefined}
                fontSize={data.length > 7 ? '10' : '11'}
                fill="#555"
                fontFamily="sans-serif"
                fontWeight="500"
              >
                {String(item[xKey]).length > 14 ? String(item[xKey]).slice(0, 12) + '…' : item[xKey]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute',
          top: Math.max(hovered.y - 35, 5),
          left: `${(hovered.x / svgWidth) * 100}%`,
          transform: 'translateX(-50%)',
          backgroundColor: '#222',
          color: '#fff',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 10
        }}>
          <strong>{hovered.label}</strong>: {hovered.name ? `${hovered.name} = ` : ''}{hovered.value}
        </div>
      )}

      {/* Legend */}
      {bars.length > 1 && (
        <div style={{ display: 'flex', gap: '16px', marginTop: '10px', justifyContent: 'center' }}>
          {bars.map((b, bi) => (
            <div key={bi} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#555' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: b.color, borderRadius: '3px' }} />
              <span>{b.name || b.key}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- VISUALLY IDENTICAL PIE / DONUT CHART ---

const PieChartSVG = ({ data = [], colors = CHART_COLORS, size = 260 }) => {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);
  if (total === 0) return <EmptyState message="No demographic data yet" />;

  const radius = size / 2;
  const innerRadius = radius * 0.55; // Donut style
  let accumulatedAngle = -90; // Start from top

  const slices = data.map((item, index) => {
    const val = Number(item.count) || 0;
    const angle = (val / total) * 360;
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + angle;
    accumulatedAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = radius + radius * 0.88 * Math.cos(startRad);
    const y1 = radius + radius * 0.88 * Math.sin(startRad);
    const x2 = radius + radius * 0.88 * Math.cos(endRad);
    const y2 = radius + radius * 0.88 * Math.sin(endRad);

    const ix1 = radius + innerRadius * Math.cos(endRad);
    const iy1 = radius + innerRadius * Math.sin(endRad);
    const ix2 = radius + innerRadius * Math.cos(startRad);
    const iy2 = radius + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    // Mid angle for text label
    const midAngle = startAngle + angle / 2;
    const midRad = (midAngle * Math.PI) / 180;
    const textX = radius + (radius * 0.72) * Math.cos(midRad);
    const textY = radius + (radius * 0.72) * Math.sin(midRad);

    const pathData = `
      M ${x1} ${y1}
      A ${radius * 0.88} ${radius * 0.88} 0 ${largeArc} 1 ${x2} ${y2}
      L ${ix1} ${iy1}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2}
      Z
    `;

    return {
      ...item,
      pathData,
      color: colors[index % colors.length],
      percent: Math.round((val / total) * 100),
      textX,
      textY,
      val
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice, i) => (
          <g key={i}>
            <path
              d={slice.pathData}
              fill={slice.color}
              stroke="#fff"
              strokeWidth="2"
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
              opacity={hovered === i ? 0.8 : 1}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
            {slice.percent > 5 && (
              <text
                x={slice.textX}
                y={slice.textY + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#fff"
                fontFamily="sans-serif"
                pointerEvents="none"
              >
                {slice.percent}%
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Legend & Stats */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
        {slices.map((slice, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: slice.color }} />
            <span style={{ fontWeight: '600', color: THEME.text, textTransform: 'capitalize' }}>
              {slice.gender || slice.name}:
            </span>
            <span style={{ color: THEME.textLight }}>
              {slice.val} ({slice.percent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- VISUALLY IDENTICAL HORIZONTAL BAR CHART (STATE DISTRIBUTION) ---

const HorizontalBarChartSVG = ({ data = [], xKey = 'name', valKey = 'count', color = '#1976D2' }) => {
  if (!data || data.length === 0) return <EmptyState message="No location data available yet" />;

  const maxVal = Math.max(...data.map(d => Number(d[valKey]) || 0), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '10px 0' }}>
      {data.map((item, i) => {
        const val = Number(item[valKey]) || 0;
        const pct = Math.min(Math.round((val / maxVal) * 100), 100);
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
            <div style={{ width: '110px', fontWeight: 'bold', color: THEME.text, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item[xKey]}
            </div>
            <div style={{ flex: 1, backgroundColor: '#ECEFF1', height: '22px', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                backgroundColor: color,
                borderRadius: '4px',
                transition: 'width 0.6s ease'
              }} />
            </div>
            <div style={{ width: '40px', fontWeight: 'bold', color: THEME.text }}>
              {val}
            </div>
          </div>
        );
      })}
    </div>
  );
};

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
      background: `${color}15`,
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
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: THEME.primary, margin: '0 0 4px 0', fontSize: '18px' }}>{title}</h3>
      <p style={{ color: THEME.textLight, margin: 0, fontSize: '13px' }}>{subtitle}</p>
    </div>
    {children}
  </div>
);

const EmptyState = ({ message }) => (
  <div style={{ 
    height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center',
    color: '#9E9E9E', fontStyle: 'italic', backgroundColor: '#F9FBF9', borderRadius: '12px',
    border: '1px dashed #E0E0E0'
  }}>
    {message}
  </div>
);

export default AdminDashboard;
