import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { isAuthenticated, user } = useAuth();
  const returnPath = !isAuthenticated
    ? '/login'
    : user?.role === 'admin'
    ? '/admin/dashboard'
    : '/dashboard';
  const returnLabel = !isAuthenticated ? 'Return to Sign In' : 'Return to Dashboard';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '2rem'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#fef2f2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}
      >
        <HelpCircle size={36} />
      </div>
      <h1 style={{ fontSize: '2rem', color: 'var(--slate-900)', fontWeight: '800', marginBottom: '0.5rem' }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: 'var(--slate-500)', maxWidth: '400px', marginBottom: '1.5rem' }}>
        The page you are looking for does not exist in the institutional portal.
      </p>
      <Link to={returnPath} className="btn btn-primary">
        <ArrowLeft size={16} />
        <span>{returnLabel}</span>
      </Link>
    </div>
  );
};

export default NotFound;
