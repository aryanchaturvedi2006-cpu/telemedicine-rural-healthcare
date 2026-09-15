import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGE_META } from '../translations/translations';
import logo from '../assets/logo.png';

const CursorTrail = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    let mouse = { x: -100, y: -100 };
    let lastMouse = { x: -100, y: -100 };
    
    const colors = ['#FDE047', '#FACC15', '#EAB308', '#FEF08A', '#FFFBEB'];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const handleMouseMove = (e) => {
      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      const dx = mouse.x - lastMouse.x;
      const dy = mouse.y - lastMouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // Spawn particles based on distance moved
      const spawnCount = Math.min(Math.floor(dist / 3) + 1, 15);
      
      for(let i = 0; i < spawnCount; i++) {
        const t = i / spawnCount;
        const ix = lastMouse.x + (dx * t);
        const iy = lastMouse.y + (dy * t);
        
        particles.push({
          x: ix + (Math.random() - 0.5) * 8,
          y: iy + (Math.random() - 0.5) * 8 + 10,
          size: Math.random() * 3.5 + 1.5,
          life: 1, 
          decay: Math.random() * 0.02 + 0.015,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 1,
          vy: Math.random() * 1 + 0.2
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for(let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay;
        p.x += p.vx;
        p.y += p.vy;
        
        if(p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        
        ctx.fill();
      }
      
      // Reset state for next frame
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};

const LanguageSelector = () => {
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [hoveredLang, setHoveredLang] = useState(null);

  const handleLanguageSelect = (code) => {
    setLanguage(code);
    navigate('/landing');
  };

  return (
    <div className="language-page-container" style={{
      background: '#0F172A',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '40px'
    }}>
      <CursorTrail />
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .language-page-container {
            cursor: url('/cursors/jeevanjyoti_language_cursor.svg') 0 0, auto;
          }
          .language-page-container button {
            cursor: url('/cursors/jeevanjyoti_language_cursor.svg') 0 0, pointer !important;
          }
          /* Ensure text and disabled elements keep their native cursors if added later */
          .language-page-container input, 
          .language-page-container textarea,
          .language-page-container [contenteditable="true"] {
            cursor: text !important;
          }
          .language-page-container [disabled] {
            cursor: not-allowed !important;
          }
        }
      `}</style>
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
