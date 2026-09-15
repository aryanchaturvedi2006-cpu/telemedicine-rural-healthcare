import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from '../translations/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || '';
  });

  useEffect(() => {
    if (language) {
      localStorage.setItem('appLanguage', language);
    }
  }, [language]);

  const t = (key) => {
    if (!language) return ''; // or default to 'hi' or 'en'
    const langData = translations[language] || translations['hi'];
    return langData[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
