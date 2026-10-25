import React from 'react';
import {
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Calendar,
  ExternalLink,
  BookOpen,
  Award
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

const ProfileCard = ({ faculty }) => {
  if (!faculty) return null;

  return (
    <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: '800',
            boxShadow: '0 8px 16px rgba(67, 56, 202, 0.25)',
            flexShrink: 0
          }}
        >
          {faculty.fullName ? faculty.fullName.replace(/^Dr\.\s*/i, '').charAt(0) : 'F'}
        </div>

        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--slate-900)' }}>{faculty.fullName}</h2>
            <span className="badge badge-other">
              {faculty.employeeId}
            </span>
          </div>

          <p style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--primary-light)', marginBottom: '0.5rem' }}>
            {faculty.designation} • {faculty.department}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
            {faculty.email && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} color="var(--primary-light)" /> {faculty.email}
              </span>
            )}
            {faculty.phone && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={14} color="var(--primary-light)" /> {faculty.phone}
              </span>
            )}
            {faculty.highestQualification && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <GraduationCap size={14} color="var(--primary-light)" /> {faculty.highestQualification}
              </span>
            )}
            {faculty.specialization && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={14} color="var(--primary-light)" /> {faculty.specialization}
              </span>
            )}
          </div>

          {faculty.researchInterests && faculty.researchInterests.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Research Interests
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {faculty.researchInterests.map((interest, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'var(--slate-100)',
                      color: 'var(--slate-700)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: '500',
                      border: '1px solid var(--slate-200)'
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {faculty.orcid && (
              <a
                href={`https://orcid.org/${faculty.orcid}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.825rem', color: '#a6ce39', fontWeight: '600', background: '#f8fafc', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              >
                <ExternalLink size={13} /> ORCID: {faculty.orcid}
              </a>
            )}
            {faculty.googleScholar && (
              <a
                href={faculty.googleScholar}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.825rem', color: '#4285f4', fontWeight: '600', background: '#f8fafc', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              >
                <ExternalLink size={13} /> Google Scholar
              </a>
            )}
            {faculty.linkedin && (
              <a
                href={faculty.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.825rem', color: '#0077b5', fontWeight: '600', background: '#f8fafc', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              >
                <ExternalLink size={13} /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
