import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGE_META } from '../translations/translations';
import logo from '../assets/logo.png';

const LanguageSelector = () => {
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [hoveredLang, setHoveredLang] = useState(null);

  const handleLanguageSelect = (code) => {
    setLanguage(code);
    navigate('/landing');
  };

  return (
    <div style={{
      background: '#0F172A',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '40px'
    }}>
      <div style={{ textAlign: 'center', paddingTop: '36px', marginBottom: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '12px 20px',
          display: 'inline-block',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.12)',
          marginBottom: '16px'
        }}>
          <img src={logo} alt="JeevanJyoti Logo" style={{
            height: '80px',
            width: 'auto',
            objectFit: 'contain',
            display: 'block'
          }} />
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '6px' }}>
          <h1 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '36px',
            fontWeight: 700,
            color: '#4ADE80',
            margin: '0 0 4px 0',
            letterSpacing: '0.5px',
            lineHeight: 1.1
          }}>
            JeevanJyoti
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '4px',
            marginBottom: '28px'
          }}>
            <span style={{
              display: 'inline-block',
              width: '28px',
              height: '1.5px',
              background: '#F59E0B'
            }}></span>
            <span style={{
              fontSize: '11px',
              color: '#F59E0B',
              letterSpacing: '3px',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontFamily: 'system-ui, Arial, sans-serif'
            }}>RURAL HEALTHCARE</span>
            <span style={{
              display: 'inline-block',
              width: '28px',
              height: '1.5px',
              background: '#F59E0B'
            }}></span>
          </div>
        </div>

        <div>
          <span style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '15px' }}>अपनी भाषा चुनें</span>
          <span style={{ color: '#94A3B8', fontSize: '15px' }}> · Select your language</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        maxWidth: '440px',
        width: '100%',
        margin: '24px auto 0',
        padding: '0 16px',
        boxSizing: 'border-box'
      }}>
        {LANGUAGE_META.map((lang) => (
          <button 
            key={lang.code}
            onMouseEnter={() => setHoveredLang(lang.code)}
            onMouseLeave={() => setHoveredLang(null)}
            onClick={() => handleLanguageSelect(lang.code)}
            style={{
              background: hoveredLang === lang.code ? '#34D399' : '#1E293B',
              border: `1px solid ${hoveredLang === lang.code ? '#34D399' : '#334155'}`,
              borderRadius: '12px',
              padding: '16px 12px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              outline: 'none'
            }}
          >
            <span style={{
              fontSize: '17px',
              fontWeight: 600,
              color: hoveredLang === lang.code ? '#0F172A' : '#E2E8F0',
              transition: 'color 0.18s ease'
            }}>
              {lang.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
