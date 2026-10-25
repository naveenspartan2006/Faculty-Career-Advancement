import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Building2,
  Trophy,
  Award,
  FolderGit2,
  Calendar,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Loading from '../components/Loading';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/statistics');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return <Loading message="Loading institutional statistics..." />;
  }

  const summary = data?.summary || {};
  const charts = data?.charts || {};

  const maxDeptPubs = Math.max(...(charts.publicationsByDepartment?.map((d) => d.count) || [1]), 1);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Institutional Admin Dashboard</h1>
          <p className="page-header-subtitle">
            College-wide oversight of faculty research achievements, publication indices, and grants.
          </p>
        </div>

        <div className="page-actions-group">
          <Link to="/admin/faculty" className="btn btn-primary btn-sm">
            <Users size={16} />
            <span>Faculty Directory</span>
          </Link>
        </div>
      </div>

      {/* College-wide KPI Cards */}
      <div className="stats-grid">
        <DashboardCard
          title="Total Faculty"
          value={summary.totalFaculty || 0}
          subtext="Registered academicians"
          icon={Users}
          colorTheme="indigo"
        />
        <DashboardCard
          title="Total Publications"
          value={summary.totalPublications || 0}
          subtext="Across all departments"
          icon={BookOpen}
          colorTheme="emerald"
        />
        <DashboardCard
          title="Departments"
          value={summary.totalDepartments || 0}
          subtext="Academic divisions"
          icon={Building2}
          colorTheme="amber"
        />
        <DashboardCard
          title="Achievements"
          value={summary.totalAchievements || 0}
          subtext="Honors & awards"
          icon={Trophy}
          colorTheme="rose"
        />
        <DashboardCard
          title="Certifications"
          value={summary.totalCertifications || 0}
          subtext="Industry credentials"
          icon={Award}
          colorTheme="purple"
        />
        <DashboardCard
          title="Funded Projects"
          value={summary.totalProjects || 0}
          subtext="Sponsored research"
          icon={FolderGit2}
          colorTheme="sky"
        />
      </div>

      {/* Department-wise Publications Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Publications by Department</h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Breakdown</span>
          </div>

          {charts.publicationsByDepartment && charts.publicationsByDepartment.length > 0 ? (
            <div style={{ marginTop: '0.5rem' }}>
              {charts.publicationsByDepartment.map((item, idx) => {
                const pct = summary.totalPublications
                  ? Math.round((item.count / summary.totalPublications) * 100)
                  : 0;
                return (
                  <div key={idx} className="progress-bar-group">
                    <div className="progress-label-row">
                      <span>{item.department}</span>
                      <span><strong>{item.count}</strong> ({pct}%)</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${pct}%`, background: '#4338ca' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
              No department publications recorded yet.
            </div>
          )}
        </div>

        {/* Indexing Breakdown */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">College Indexing Distribution</h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Quality Metrics</span>
          </div>

          {charts.publicationsByIndexing && charts.publicationsByIndexing.length > 0 ? (
            <div style={{ marginTop: '0.5rem' }}>
              {charts.publicationsByIndexing.map((item, idx) => {
                const pct = summary.totalPublications
                  ? Math.round((item.count / summary.totalPublications) * 100)
                  : 0;
                return (
                  <div key={idx} className="progress-bar-group">
                    <div className="progress-label-row">
                      <span>{item.indexing || 'Other'}</span>
                      <span><strong>{item.count}</strong> ({pct}%)</span>
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
                              : '#64748b'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
              No indexing data recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Faculty by Department & Publication Types */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--slate-800)' }}>Faculty Distribution by Department</h3>
            <Link to="/admin/faculty" style={{ fontSize: '0.8rem', fontWeight: '600' }}>
              View Directory →
            </Link>
          </div>

          {charts.facultyByDepartment?.map((dept, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.65rem 0',
                borderBottom: '1px solid var(--slate-200)',
                fontSize: '0.875rem'
              }}
            >
              <span style={{ color: 'var(--slate-700)' }}>{dept.department}</span>
              <span className="badge badge-other" style={{ fontWeight: '700' }}>
                {dept.count} Faculty
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.05rem', color: 'var(--slate-800)', marginBottom: '1rem' }}>
            Scholarly Output by Format
          </h3>

          {charts.publicationsByType?.map((t, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.65rem 0',
                borderBottom: '1px solid var(--slate-200)',
                fontSize: '0.875rem'
              }}
            >
              <span style={{ color: 'var(--slate-700)' }}>{t.type}</span>
              <span className="badge badge-national" style={{ fontWeight: '700' }}>
                {t.count} Works
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
