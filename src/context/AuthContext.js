import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const sessionStored = sessionStorage.getItem('tele_user');
    if (sessionStored) return JSON.parse(sessionStored);
    const localStored = localStorage.getItem('tele_user');
    return localStored ? JSON.parse(localStored) : null;
  });

  const login = (userData, staySignedIn = false) => {
    setUser(userData);
    if (staySignedIn) {
      localStorage.setItem('tele_user', JSON.stringify(userData));
      sessionStorage.removeItem('tele_user');
    } else {
      sessionStorage.setItem('tele_user', JSON.stringify(userData));
      localStorage.removeItem('tele_user');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tele_user');
    sessionStorage.removeItem('tele_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
