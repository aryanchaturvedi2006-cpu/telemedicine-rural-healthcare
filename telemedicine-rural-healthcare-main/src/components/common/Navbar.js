import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar({ variant = 'default' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className={`navbar navbar--${variant}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__icon">+</span>
          <span className="navbar__title">TeleMed Rural</span>
        </Link>

        <nav className="navbar__nav">
          {!user && (
            <>
              <Link to="/login"    className="navbar__link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
          {user && (
            <div className="navbar__user">
              <div className="navbar__user-info">
                <div className="avatar" style={{ width: 34, height: 34, fontSize: '0.85rem' }}>
                  {initials}
                </div>
                <span className="navbar__user-name">{user.name}</span>
                <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                  {user.role}
                </span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
