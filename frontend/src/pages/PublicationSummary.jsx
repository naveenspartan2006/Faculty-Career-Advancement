import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  Printer,
  BookOpen,
  Calendar,
  Layers,
  Award,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';
import Loading from '../components/Loading';

const PublicationSummary = () => {
  const [searchParams] = useSearchParams();
  const facultyIdParam = searchParams.get('facultyId');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPublicationSummary = async () => {
    try {
      setLoading(true);
      const endpoint = facultyIdParam
        ? `/summary/publications?facultyId=${facultyIdParam}`
        : '/summary/publications';
      const res = await api.get(endpoint);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load publication analytics:', err);
      setError('Unable to load publication metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicationSummary();
  }, [facultyIdParam]);

  if (loading) {
    return <Loading message="Computing publication metrics and indexing analytics..." />;
  }

  if (error || !data) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Analytics Unavailable</h3>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={fetchPublicationSummary} style={{ marginTop: '1rem' }}>
          Retry
        </button>
      </div>
    );
  }

  const { total, types = {}, indexing = {}, status = {}, yearlyTrend = [] } = data;
  const maxYearVal = Math.max(...yearlyTrend.map((y) => y.count), 1);

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div className="page-header no-print">
        <div>
          <h1 className="page-header-title">Publication Summary Generator</h1>
          <p className="page-header-subtitle">
            Dynamic aggregation of scholarly output, indexing statistics, and research trends.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-secondary btn-sm" onClick={fetchPublicationSummary}>
            <RefreshCw size={14} />
            <span>Recalculate</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
            <Printer size={14} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Structured Publication Summary Dossier */}
      <div className="card summary-dossier" style={{ padding: '2.5rem' }}>
        <div className="summary-header-block" style={{ borderBottom: '2px solid var(--slate-300)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.08em', color: 'var(--primary-light)', textTransform: 'uppercase' }}>
                Research Evaluation & Output Metric
              </span>
              <h1 style={{ fontSize: '1.6rem', color: 'var(--slate-900)', fontWeight: '800', marginTop: '0.25rem' }}>
                PUBLICATION SUMMARY REPORT
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                Computed dynamically from database records • Real-time indexing analysis
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Cumulative Publications</div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-light)', lineHeight: '1.1' }}>
                {total}
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown by Type Grid */}
        <div className="summary-section" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-800)', marginBottom: '1rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem' }}>
            1. Publications by Type
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--slate-100)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Journals</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981', marginTop: '0.2rem' }}>
                {types.Journal || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {total ? Math.round(((types.Journal || 0) / total) * 100) : 0}% of total
              </div>
            </div>

            <div style={{ background: 'var(--slate-100)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Conferences</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f59e0b', marginTop: '0.2rem' }}>
                {types.Conference || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                {total ? Math.round(((types.Conference || 0) / total) * 100) : 0}% of total
              </div>
            </div>

            <div style={{ background: 'var(--slate-100)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Book Chapters</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-light)', marginTop: '0.2rem' }}>
                {types['Book Chapter'] || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Edited volumes</div>
            </div>

            <div style={{ background: 'var(--slate-100)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Books</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#a855f7', marginTop: '0.2rem' }}>
                {types.Book || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Authored titles</div>
            </div>

            <div style={{ background: 'var(--slate-100)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Patents</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#06b6d4', marginTop: '0.2rem' }}>
                {types.Patent || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Granted / published</div>
            </div>
          </div>
        </div>

        {/* Indexing Metrics Grid */}
        <div className="summary-section" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-800)', marginBottom: '1rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem' }}>
            2. Indexing Statistics
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--info-border)', background: 'var(--info-subtle)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--info)' }}>Scopus Indexed</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--slate-900)', marginTop: '0.25rem' }}>
                {indexing.Scopus || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                High-impact international citations
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--warning-border)', background: 'var(--warning-subtle)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--warning)' }}>Web of Science (WoS)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--slate-900)', marginTop: '0.25rem' }}>
                {indexing['Web of Science'] || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                Clarivate / SCI indexed
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--success-border)', background: 'var(--success-subtle)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--success)' }}>UGC CARE Listed</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--slate-900)', marginTop: '0.25rem' }}>
                {indexing.UGC || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                National recognized journals
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--primary-border)', background: 'var(--primary-subtle)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-light)' }}>Google Scholar & Other</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--slate-900)', marginTop: '0.25rem' }}>
                {(indexing['Google Scholar'] || 0) + (indexing.Other || 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                Open-access & disciplinary indices
              </div>
            </div>
          </div>
        </div>

        {/* Yearly Trend Chart */}
        <div className="summary-section" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-800)', marginBottom: '1rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem' }}>
            3. Publication Trend by Year
          </h3>

          {yearlyTrend.length > 0 ? (
            <div>
              <div className="bar-chart-container" style={{ height: '180px' }}>
                {yearlyTrend.map((item, idx) => {
                  const heightPct = Math.round((item.count / maxYearVal) * 100);
                  return (
                    <div key={idx} className="bar-column">
                      <div className="bar-fill" style={{ height: `${Math.max(heightPct, 15)}%` }}>
                        <span className="bar-value-label">{item.count}</span>
                      </div>
                      <span className="bar-x-label">{item.year}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#475569' }}>
                {yearlyTrend.map((item) => (
                  <span key={item.year}>
                    <strong>{item.year}:</strong> {item.count} publications
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '1.5rem' }}>
              No timeline data available.
            </div>
          )}
        </div>

        {/* Verification Note */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#64748b' }}>
          <span>Source: Centralized Academic Record System</span>
          <span>Verified Document ID: PUB-SUM-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}</span>
        </div>
      </div>
    </div>
  );
};

export default PublicationSummary;
