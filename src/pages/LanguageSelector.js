import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGE_META } from '../translations/translations';

const LanguageSelector = () => {
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLanguageSelect = (code) => {
    setLanguage(code);
    navigate('/patient-registration');
  };

  return (
    <div className="language-selector-container">
      <div className="language-header">
        <h1>Select Your Language</h1>
        <p>अपनी भाषा चुनें / اپنی زبان منتخب کریں / اپنی ٻولي چُونڊيو</p>
      </div>
      
      <div className="language-grid">
        {LANGUAGE_META.map((lang) => (
          <button 
            key={lang.code} 
            className="lang-card"
            onClick={() => handleLanguageSelect(lang.code)}
          >
            <span className="lang-label">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
