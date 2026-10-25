import React from 'react';
import { Trophy, Calendar, Award, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const AchievementCard = ({ achievement, onEdit, onDelete, canModify = true }) => {
  const getLevelClass = (lvl) => {
    switch (lvl) {
      case 'International':
        return 'badge-international';
      case 'National':
        return 'badge-national';
      case 'State':
        return 'badge-state';
      default:
        return 'badge-institution';
    }
  };

  return (
    <div className="card card-hover" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            <span className="badge" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
              {achievement.category}
            </span>
            <span className={`badge ${getLevelClass(achievement.level)}`}>
              {achievement.level} Level
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={13} /> {formatDate(achievement.date)}
            </span>
          </div>

          <h3 style={{ fontSize: '1.05rem', color: 'var(--slate-800)', marginBottom: '0.35rem', fontWeight: '700' }}>
            {achievement.title}
          </h3>

          <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', fontWeight: '500', marginBottom: '0.4rem' }}>
            Conferred by: <span style={{ color: 'var(--slate-800)', fontWeight: '600' }}>{achievement.organization}</span>
          </p>

          {achievement.description && (
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '0.6rem', lineHeight: '1.5' }}>
              {achievement.description}
            </p>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {achievement.certificateNumber && (
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Cert. No: <strong>{achievement.certificateNumber}</strong>
              </span>
            )}
            {achievement.verificationUrl && (
              <a
                href={achievement.verificationUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.8rem', color: '#4338ca', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}
              >
                <ExternalLink size={13} /> Verify Credential
              </a>
            )}
          </div>
        </div>

        {canModify && (
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {onEdit && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onEdit(achievement)}
                title="Edit Achievement"
              >
                <Edit2 size={14} />
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDelete(achievement._id, achievement.title)}
                title="Delete Achievement"
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

export default AchievementCard;
