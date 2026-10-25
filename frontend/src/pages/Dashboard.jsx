import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Users,
  Trophy,
  Award,
  FolderGit2,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  PlusCircle,
  FileSpreadsheet,
  BarChart3,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';

const Dashboard = () => {
  const { user, faculty } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/summary/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
        setError('Unable to load dashboard data. Please check connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <Loading message="Aggregating faculty academic records..." />;
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ color: 'var(--slate-800)' }}>Failed to Load Dashboard</h3>
        <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>{error}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
          style={{ marginTop: '1.5rem' }}
        >
          Retry
        </button>
      </div>
    );
  }

  const counts = data?.counts || {};
  const recentPubs = data?.recentPublications || [];
  const recentAchs = data?.recentAchievements || [];
  const charts = data?.charts || {};

  // Find max value in yearly publications for bar chart scaling
  const maxYearPubs = Math.max(...(charts.publicationsByYear?.map((p) => p.count) || [1]), 1);

  return (
    <div>
      {/* Welcome & Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Faculty Dashboard</h1>
          <p className="page-header-subtitle">
            Welcome back, <strong>{user?.name}</strong> • {faculty?.designation || user?.designation} ({faculty?.department || user?.department})
          </p>
        </div>

        <div className="page-actions-group">
          <Link to="/publications/add" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>Add Publication</span>
          </Link>
          <Link to="/career-summary" className="btn btn-secondary btn-sm">
            <FileSpreadsheet size={16} />
            <span>Career Summary</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <DashboardCard
          title="Total Publications"
          value={counts.totalPublications || 0}
          subtext="Articles, papers, chapters"
          icon={BookOpen}
          colorTheme="indigo"
        />
        <DashboardCard
          title="Journal Papers"
          value={counts.journalCount || 0}
          subtext="Peer-reviewed journals"
          icon={FileText}
          colorTheme="emerald"
        />
        <DashboardCard
          title="Conferences"
          value={counts.conferenceCount || 0}
          subtext="Proceedings & presentations"
          icon={Users}
          colorTheme="amber"
        />
        <DashboardCard
          title="Achievements"
          value={counts.totalAchievements || 0}
          subtext="Honors, awards & patents"
          icon={Trophy}
          colorTheme="rose"
        />
        <DashboardCard
          title="Certifications"
          value={counts.totalCertifications || 0}
          subtext="Professional credentials"
          icon={Award}
          colorTheme="purple"
        />
        <DashboardCard
          title="Funded Projects"
          value={counts.totalProjects || 0}
          subtext="Research & consultancy"
          icon={FolderGit2}
          colorTheme="sky"
        />
      </div>

      {/* Academic Progress & Career Advancement Overview */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #0e1017 0%, #151016 100%)',
          borderLeft: '4px solid var(--primary)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 15px rgba(220, 38, 38, 0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-900)', fontWeight: '800' }}>
              Academic Progress Summary
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)' }}>
              Dynamic institutional appraisal indicators calculated from your database records.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/career-summary" className="btn btn-secondary btn-sm">
              Detailed Appraisal Dossier <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: 'var(--slate-100)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              Research Output Ratio
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--slate-900)', marginTop: '0.25rem' }}>
              {counts.totalPublications ? Math.round(((counts.journalCount + counts.conferenceCount) / counts.totalPublications) * 100) : 0}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Journals + Conferences share</div>
          </div>

          <div style={{ background: 'var(--slate-100)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              Indexed Publications
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f87171', marginTop: '0.25rem' }}>
              {charts.publicationsByIndexing?.filter((i) => ['Scopus', 'Web of Science', 'UGC'].includes(i.indexing)).reduce((acc, curr) => acc + curr.count, 0) || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Scopus / WoS / UGC indexed</div>
          </div>

          <div style={{ background: 'var(--slate-100)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              Professional Engagement
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34d399', marginTop: '0.25rem' }}>
              {(counts.totalCertifications || 0) + (counts.totalConferences || 0)} Events
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Certificates & Conferences</div>
          </div>

          <div style={{ background: 'var(--slate-100)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              Active Research Grants
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fbbf24', marginTop: '0.25rem' }}>
              {counts.totalProjects || 0} Projects
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>External & internal funding</div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Publications by Year Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Publications by Year</h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Trend</span>
          </div>

          {charts.publicationsByYear && charts.publicationsByYear.length > 0 ? (
            <div className="bar-chart-container">
              {charts.publicationsByYear.map((item, idx) => {
                const heightPercent = Math.round((item.count / maxYearPubs) * 100);
                return (
                  <div key={idx} className="bar-column">
                    <div className="bar-fill" style={{ height: `${Math.max(heightPercent, 12)}%` }}>
                      <span className="bar-value-label">{item.count}</span>
                    </div>
                    <span className="bar-x-label">{item.year}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              No publication records yet to plot yearly trend.
            </div>
          )}
        </div>

        {/* Indexing Breakdown */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Indexing Distribution</h3>
            <Link to="/publication-summary" style={{ fontSize: '0.8rem', fontWeight: '600' }}>
              View Details →
            </Link>
          </div>

          {charts.publicationsByIndexing && charts.publicationsByIndexing.length > 0 ? (
            <div style={{ marginTop: '0.5rem' }}>
              {charts.publicationsByIndexing.map((item, idx) => {
                const pct = counts.totalPublications
                  ? Math.round((item.count / counts.totalPublications) * 100)
                  : 0;
                return (
                  <div key={idx} className="progress-bar-group">
                    <div className="progress-label-row">
                      <span>{item.indexing || 'Other'}</span>
                      <span>
                        <strong>{item.count}</strong> ({pct}%)
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${pct}%`,
                          background:
                            item.indexing === 'Scopus'
                              ? '#2563eb'
                              : item.indexing === 'Web of Science'
                              ? '#ea580c'
                              : item.indexing === 'UGC'
                              ? '#16a34a'
                              : '#6366f1'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              No publications with indexing data yet.
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Publications */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-800)' }}>Recent Publications</h3>
            <Link to="/publications" style={{ fontSize: '0.825rem', fontWeight: '600' }}>
              All Publications ({counts.totalPublications || 0}) →
            </Link>
          </div>

          {recentPubs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentPubs.map((pub) => (
                <div
                  key={pub._id}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--slate-200)',
                    background: 'var(--slate-100)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-other" style={{ fontSize: '0.7rem' }}>
                      {pub.publicationType}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {formatDate(pub.publicationDate)}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--slate-800)', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {pub.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    {pub.journalName || pub.conferenceName || 'Institutional Record'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-500)' }}>
              No publications recorded. Click "Add Publication" to begin.
            </div>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-800)' }}>Recent Achievements</h3>
            <Link to="/achievements" style={{ fontSize: '0.825rem', fontWeight: '600' }}>
              All Achievements ({counts.totalAchievements || 0}) →
            </Link>
          </div>

          {recentAchs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentAchs.map((ach) => (
                <div
                  key={ach._id}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--slate-200)',
                    background: 'var(--slate-100)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-national" style={{ fontSize: '0.7rem' }}>
                      {ach.level}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {formatDate(ach.date)}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--slate-800)', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {ach.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    {ach.organization} • {ach.category}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-500)' }}>
              No achievements recorded. Click "Add Achievement" to log awards & honors.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
