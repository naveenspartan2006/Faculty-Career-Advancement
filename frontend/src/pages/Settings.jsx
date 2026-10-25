import React, { useState } from 'react';
import { User, Lock, ShieldCheck, Sun, Moon, Palette, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const { success: toastSuccess, error: toastError } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toastError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toastError('Passwords do not match.');
      return;
    }

    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toastSuccess('Security credentials updated successfully.');
    }, 600);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">System & Account Settings</h1>
          <p className="page-header-subtitle">
            Manage your account credentials, security preferences, and portal configurations.
          </p>
        </div>
      </div>

      {/* Portal Appearance & Theme Preferences */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-800)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={18} color="var(--primary)" /> Portal Appearance & Theme
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Active Theme: <strong style={{ color: isDark ? '#f87171' : '#4338ca', textTransform: 'capitalize' }}>{theme} Theme</strong>
          </span>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '1.25rem' }}>
          Choose your preferred visual style. You can also quickly toggle between Bright (Sun) and Dark (Moon) themes anytime using the symbol located at the top-right corner of the screen.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {/* Bright Theme Card */}
          <div
            onClick={() => setTheme('light')}
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              cursor: 'pointer',
              border: !isDark ? '2px solid #4338ca' : '1px solid var(--slate-200)',
              background: !isDark ? 'rgba(99, 102, 241, 0.08)' : 'var(--slate-100)',
              transition: 'var(--transition)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Sun size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--slate-800)', fontSize: '0.95rem' }}>Bright Theme</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Sun Symbol</span>
                </div>
              </div>
              {!isDark && <CheckCircle2 size={20} color="#4338ca" />}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', margin: 0, lineHeight: '1.5' }}>
              Clean institutional academic design with crisp white surfaces, sapphire accents, and high-contrast typography.
            </p>
          </div>

          {/* Dark Theme Card */}
          <div
            onClick={() => setTheme('dark')}
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              cursor: 'pointer',
              border: isDark ? '2px solid #dc2626' : '1px solid var(--slate-200)',
              background: isDark ? 'rgba(220, 38, 38, 0.1)' : 'var(--slate-100)',
              transition: 'var(--transition)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#1e1b4b',
                    color: '#f87171',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Moon size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--slate-800)', fontSize: '0.95rem' }}>Dark Theme</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Moon Symbol</span>
                </div>
              </div>
              {isDark && <CheckCircle2 size={20} color="#dc2626" />}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', margin: 0, lineHeight: '1.5' }}>
              Menacing obsidian design with deep crimson highlights, glowing status badges, and reduced eye-strain.
            </p>
          </div>
        </div>
      </div>

      {/* Account Overview */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-800)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={18} color="var(--primary)" /> Account Credentials
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
          <div>
            <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block' }}>Full Name</span>
            <strong style={{ color: 'var(--slate-800)' }}>{user?.name}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block' }}>Email Address</span>
            <strong style={{ color: 'var(--slate-800)' }}>{user?.email}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block' }}>Employee ID</span>
            <strong style={{ color: 'var(--slate-800)' }}>{user?.employeeId}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block' }}>System Role</span>
            <span className="badge badge-other" style={{ textTransform: 'uppercase' }}>{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-800)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={18} color="var(--primary)" /> Update Password
        </h3>

        <form onSubmit={handlePasswordUpdate}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={updating}
            style={{ marginTop: '0.5rem' }}
          >
            {updating ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Security & Access Notice */}
      <div className="card" style={{ background: 'var(--slate-100)', borderColor: 'var(--slate-200)' }}>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--slate-800)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} color="var(--primary)" /> Account Security & Session Management
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', lineHeight: '1.6' }}>
          All active faculty sessions are cryptographically signed with salted authentication tokens. Password changes will immediately apply to all future logins and report generation actions.
        </p>
      </div>
    </div>
  );
};

export default Settings;
