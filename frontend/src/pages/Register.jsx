import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, User, Building2, Briefcase, Hash, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import ThemeToggle from '../components/ThemeToggle';
import { isValidEmail, isValidPassword } from '../utils/validation';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    employeeId: '',
    department: 'Computer Science and Engineering',
    designation: 'Assistant Professor'
  });
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toastError('Full name is required');
      return;
    }

    if (!isValidEmail(formData.email)) {
      toastError('Please provide a valid email address');
      return;
    }

    if (!isValidPassword(formData.password)) {
      toastError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toastError('Passwords do not match');
      return;
    }

    if (!formData.employeeId.trim()) {
      toastError('Employee ID is required');
      return;
    }

    try {
      setSubmitting(true);
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        employeeId: formData.employeeId.trim(),
        department: formData.department,
        designation: formData.designation,
        role: 'faculty'
      });

      toastSuccess('Registration successful! Welcome to the portal.');
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (err?.message && err.message !== 'Network Error' ? err.message : null) ||
        'Registration failed. Please check your details and try again.';
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
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
        padding: '2.5rem 1rem',
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
          maxWidth: '560px',
          background: isDark ? 'rgba(13, 15, 23, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          borderRadius: '20px',
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 35px rgba(220, 38, 38, 0.22)'
            : '0 20px 45px -10px rgba(0, 0, 0, 0.1)',
          padding: '2.5rem',
          border: isDark ? '1px solid rgba(220, 38, 38, 0.35)' : '1px solid #e2e8f0',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              margin: '0 auto 0.75rem',
              borderRadius: '14px',
              background: isDark
                ? 'linear-gradient(135deg, #7f1d1d, #dc2626)'
                : 'linear-gradient(135deg, #4338ca, #6366f1)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isDark ? '0 0 18px rgba(220, 38, 38, 0.5)' : '0 10px 20px -5px rgba(67, 56, 202, 0.4)'
            }}
          >
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: '1.45rem', color: isDark ? '#ffffff' : '#0f172a', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Faculty Registration
          </h1>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem' }}>
            Create an academic profile to manage publications &amp; career metrics
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="reg-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Dr. Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-empid">
                Employee ID <span className="required">*</span>
              </label>
              <input
                id="reg-empid"
                name="employeeId"
                type="text"
                className="form-input"
                placeholder="FAC-CSE-102"
                value={formData.employeeId}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              Institutional Email <span className="required">*</span>
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="jane.doe@college.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-dept">
                Department <span className="required">*</span>
              </label>
              <select
                id="reg-dept"
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                <option value="Computer Science and Design">Computer Science and Design</option>
                <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Applied Sciences & Humanities">Applied Sciences &amp; Humanities</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-desig">
                Designation <span className="required">*</span>
              </label>
              <select
                id="reg-desig"
                name="designation"
                className="form-select"
                value={formData.designation}
                onChange={handleChange}
              >
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor">Professor</option>
                <option value="Head of Department">Head of Department</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-pass">
                Password <span className="required">*</span>
              </label>
              <input
                id="reg-pass"
                name="password"
                type="password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.75rem' }}
          >
            {submitting ? 'Creating Profile...' : 'Complete Registration'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: '700', color: '#f87171' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
