import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  BookOpen,
  Trophy,
  Award,
  Calendar,
  FolderGit2,
  FileSpreadsheet,
  BarChart3,
  Settings,
  LogOut,
  Users,
  GraduationCap,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''} no-print`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <GraduationCap size={22} />
          </div>
          <div className="sidebar-title-group">
            <h2>Faculty Portal</h2>
            <p>Career &amp; Research Tracker</p>
          </div>
          {isOpen && (
            <button
              onClick={onClose}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {isAdmin ? (
            <>
              <div className="sidebar-nav-section">Institutional Admin</div>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <LayoutDashboard size={18} />
                <span>Admin Dashboard</span>
              </NavLink>

              <NavLink
                to="/admin/faculty"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Users size={18} />
                <span>Faculty Directory</span>
              </NavLink>

              <NavLink
                to="/admin/statistics"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <BarChart3 size={18} />
                <span>College Analytics</span>
              </NavLink>
            </>
          ) : (
            <>
              <div className="sidebar-nav-section">Main Menu</div>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <User size={18} />
                <span>Faculty Profile</span>
              </NavLink>

              <div className="sidebar-nav-section">Academic Portfolio</div>
              <NavLink
                to="/publications"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <BookOpen size={18} />
                <span>Publications</span>
              </NavLink>

              <NavLink
                to="/achievements"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Trophy size={18} />
                <span>Achievements</span>
              </NavLink>

              <NavLink
                to="/certifications"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Award size={18} />
                <span>Certifications</span>
              </NavLink>

              <NavLink
                to="/conferences"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Calendar size={18} />
                <span>Conferences &amp; FDP</span>
              </NavLink>

              <NavLink
                to="/projects"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <FolderGit2 size={18} />
                <span>Research Projects</span>
              </NavLink>

              <div className="sidebar-nav-section">Summary &amp; Appraisal</div>
              <NavLink
                to="/career-summary"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <FileSpreadsheet size={18} />
                <span>Career Summary</span>
              </NavLink>

              <NavLink
                to="/publication-summary"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <BarChart3 size={18} />
                <span>Publication Summary</span>
              </NavLink>
            </>
          )}

          <div className="sidebar-nav-section">System</div>
          <NavLink
            to="/settings"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={logout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
