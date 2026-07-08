import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__icon">+</span>
          <span>TeleMed Rural</span>
        </div>
        <p className="footer__copy">
          Bridging the healthcare gap in rural communities through technology.
        </p>
        <p className="footer__copy text-xs">
          Phase 1 Prototype &mdash; Telemedicine Optimization for Rural Healthcare using AI/ML
        </p>
      </div>
    </footer>
  );
}
