import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, GraduationCap, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      toastError('Please enter both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(email, password);
      toastSuccess(`Welcome back, ${user.name}!`);

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toastError(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    // Directly submit
    setTimeout(() => {
      login(demoEmail, demoPassword)
        .then((user) => {
          toastSuccess(`Logged in as ${user.name}`);
          if (user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        })
        .catch((err) => {
          toastError(err.response?.data?.message || 'Login failed');
        });
    }, 100);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark
          ? 'radial-gradient(circle at top, rgba(220, 38, 38, 0.2), transparent 45%), linear-gradient(135deg, #050609 0%, #0c0d15 50%, #050609 100%)'
          : 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0e7ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative'
      }}
    >
      {/* Top Right Theme Selector (Sun: Bright / Moon: Dark) */}
      <div className="top-right-theme-floating">
        <ThemeToggle />
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: isDark ? 'rgba(13, 15, 23, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          borderRadius: '20px',
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 35px rgba(220, 38, 38, 0.22)'
            : '0 20px 45px -10px rgba(0, 0, 0, 0.1)',
          padding: '2.5rem 2rem',
          border: isDark ? '1px solid rgba(220, 38, 38, 0.35)' : '1px solid #e2e8f0',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 1rem',
              borderRadius: '16px',
              background: isDark
                ? 'linear-gradient(135deg, #7f1d1d, #dc2626)'
                : 'linear-gradient(135deg, #4338ca, #6366f1)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isDark ? '0 0 20px rgba(220, 38, 38, 0.5)' : '0 10px 20px -5px rgba(67, 56, 202, 0.4)'
            }}
          >
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: '1.45rem', color: isDark ? '#ffffff' : '#0f172a', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Faculty Career Portal
          </h1>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Career Advancement &amp; Publication Summary Generator
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Institutional Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="name@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            {submitting ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: isDark ? '#94a3b8' : '#64748b' }}>
          New faculty member?{' '}
          <Link to="/register" style={{ fontWeight: '700', color: isDark ? '#f87171' : '#4338ca' }}>
            Register Account
          </Link>
        </div>

        {/* 1-Click Evaluation Accounts */}
        <div
          style={{
            marginTop: '2rem',
            padding: '1.25rem',
            background: isDark ? '#090a10' : '#f8fafc',
            borderRadius: '12px',
            border: isDark ? '1px solid #1c2033' : '1px solid #e2e8f0'
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: isDark ? '#ef4444' : '#475569',
              marginBottom: '0.75rem',
              textAlign: 'center'
            }}
          >
            ⚡ Quick Demo Accounts (1-Click Login)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin('dr.rajesh@college.edu', 'Faculty@123')}
              style={{ justifyContent: 'space-between', width: '100%', fontSize: '0.8rem', background: isDark ? '#121420' : '#ffffff', borderColor: isDark ? '#23283e' : '#cbd5e1' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={14} color={isDark ? '#f87171' : '#4338ca'} />
                <strong>Dr. Rajesh Kumar</strong> (CSD Professor)
              </span>
              <span style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b' }}>Faculty</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin('dr.priya@college.edu', 'Faculty@123')}
              style={{ justifyContent: 'space-between', width: '100%', fontSize: '0.8rem', background: isDark ? '#121420' : '#ffffff', borderColor: isDark ? '#23283e' : '#cbd5e1' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={14} color="#34d399" />
                <strong>Dr. Priya Sharma</strong> (ECE Assoc. Prof)
              </span>
              <span style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b' }}>Faculty</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin('admin@college.edu', 'Admin@123')}
              style={{ justifyContent: 'space-between', width: '100%', fontSize: '0.8rem', background: isDark ? '#121420' : '#ffffff', borderColor: isDark ? '#23283e' : '#cbd5e1' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} color={isDark ? '#c084fc' : '#7c3aed'} />
                <strong>System Academic Dean</strong>
              </span>
              <span style={{ fontSize: '0.75rem', color: isDark ? '#c084fc' : '#7c3aed', fontWeight: '700' }}>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
