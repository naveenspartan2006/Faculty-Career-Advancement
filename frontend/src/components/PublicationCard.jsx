import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { formatDate, formatYear } from '../utils/formatters';

const PublicationCard = ({ publication, onEdit, onDelete, canModify = true }) => {
  const [showAbstract, setShowAbstract] = useState(false);

  const getIndexingClass = (idx) => {
    switch (idx) {
      case 'Scopus':
        return 'badge-scopus';
      case 'Web of Science':
        return 'badge-wos';
      case 'UGC':
        return 'badge-ugc';
      case 'Google Scholar':
        return 'badge-scholar';
      default:
        return 'badge-other';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Published':
        return 'badge-published';
      case 'Accepted':
        return 'badge-accepted';
      case 'Under Review':
        return 'badge-review';
      default:
        return 'badge-progress';
    }
  };

  return (
    <div className="card card-hover" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <span className="badge badge-other" style={{ background: '#e0e7ff', color: '#3730a3', fontWeight: '700' }}>
              {publication.publicationType}
            </span>
            <span className={`badge ${getIndexingClass(publication.indexing)}`}>
              {publication.indexing}
            </span>
            <span className={`badge ${getStatusClass(publication.status)}`}>
              {publication.status}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={13} /> {formatDate(publication.publicationDate)}
            </span>
          </div>

          <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-800)', marginBottom: '0.4rem', fontWeight: '700' }}>
            {publication.title}
          </h3>

          <p style={{ fontSize: '0.875rem', color: 'var(--slate-700)', marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--slate-800)' }}>Authors:</strong> {Array.isArray(publication.authors) ? publication.authors.join(', ') : publication.authors}
          </p>

          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
            {publication.journalName || publication.conferenceName || 'Independent Publication'}
            {publication.volume && ` • Vol. ${publication.volume}`}
            {publication.issue && `(No. ${publication.issue})`}
            {publication.pages && ` • pp. ${publication.pages}`}
            {publication.publisher && ` • ${publication.publisher}`}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.5rem' }}>
            {publication.doi && (
              <a
                href={publication.doi.startsWith('http') ? publication.doi : `https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#4338ca', fontWeight: '600' }}
              >
                <ExternalLink size={13} /> DOI: {publication.doi}
              </a>
            )}

            {publication.issn && (
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                ISSN: {publication.issn}
              </span>
            )}

            {publication.isbn && (
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                ISBN: {publication.isbn}
              </span>
            )}

            {publication.abstract && (
              <button
                onClick={() => setShowAbstract(!showAbstract)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4338ca',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                {showAbstract ? 'Hide Abstract' : 'View Abstract'}
                {showAbstract ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

          {showAbstract && publication.abstract && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.85rem',
              background: '#f8fafc',
              borderRadius: '8px',
              borderLeft: '3px solid #6366f1',
              fontSize: '0.85rem',
              color: '#334155',
              lineHeight: '1.6'
            }}>
              {publication.abstract}
            </div>
          )}
        </div>

        {canModify && (
          <div style={{ display: 'flex', gap: '0.4rem', alignSelf: 'flex-start' }}>
            {onEdit && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onEdit(publication)}
                title="Edit Publication"
              >
                <Edit2 size={14} />
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDelete(publication._id, publication.title)}
                title="Delete Publication"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationCard;
