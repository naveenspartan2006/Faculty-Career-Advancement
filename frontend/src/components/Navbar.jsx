import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="navbar no-print">
      <div className="navbar-left">
        <button
          className="mobile-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>
        <span className="portal-title-tag">Institutional Portal</span>
      </div>

      <div className="navbar-right">
        {/* Top Right Theme Selector: Bright (Sun) & Dark (Moon) */}
        <ThemeToggle />

        {user && (
          <div className="user-badge-pill">
            <div className="user-avatar-circle">{getInitials(user.name)}</div>
            <div className="user-name-text">{user.name}</div>
            <span className={`user-role-badge ${user.role === 'admin' ? 'admin' : ''}`}>
              {user.role}
            </span>
          </div>
        )}

        <button
          className="btn btn-secondary btn-sm"
          onClick={handleLogout}
          title="Sign out of your session"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
