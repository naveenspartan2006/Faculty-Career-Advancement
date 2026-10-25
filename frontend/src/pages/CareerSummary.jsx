import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Printer,
  Download,
  GraduationCap,
  BookOpen,
  Award,
  Trophy,
  FolderGit2,
  Calendar,
  ExternalLink,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import Loading from '../components/Loading';
import { formatDate, formatCurrency } from '../utils/formatters';

const CareerSummary = () => {
  const [searchParams] = useSearchParams();
  const facultyIdParam = searchParams.get('facultyId');

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const endpoint = facultyIdParam
          ? `/summary/career?facultyId=${facultyIdParam}`
          : '/summary/career';
        const res = await api.get(endpoint);
        if (res.data.success) {
          setSummary(res.data.data);
        }
      } catch (err) {
        console.error('Failed to generate career advancement summary:', err);
        setError('Unable to load career advancement summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [facultyIdParam]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Loading message="Aggregating academic career portfolio from database..." />;
  }

  if (error || !summary) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Summary Generation Notice</h3>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>{error || 'No records available.'}</p>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { facultyDetails: fac, metrics: m, publications = [], achievements = [], certifications = [], conferences = [], projects = [] } = summary;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* Top Controls Bar (Hidden on Print) */}
      <div className="page-header no-print">
        <div>
          <h1 className="page-header-title">Career Advancement Summary</h1>
          <p className="page-header-subtitle">
            Comprehensive institutional appraisal and research portfolio report.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Structured Appraisal Dossier Card */}
      <div className="card summary-dossier" style={{ padding: '2.5rem' }}>
        {/* Institutional Formal Header */}
        <div className="summary-header-block" style={{ borderBottom: '2px solid var(--slate-300)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.08em', color: 'var(--primary-light)', textTransform: 'uppercase' }}>
                Institutional Academic Record & Appraisal Dossier
              </div>
              <h1 style={{ fontSize: '1.65rem', color: 'var(--slate-900)', fontWeight: '800', marginTop: '0.25rem' }}>
                FACULTY CAREER ADVANCEMENT SUMMARY
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                Generated dynamically from verified academic database on {formatDate(summary.generatedAt)}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-other" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                Emp ID: {fac.employeeId}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Faculty Information */}
        <div className="summary-section" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-800)', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={18} color="var(--primary-light)" /> 1. Faculty Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Full Name</span>
              <strong style={{ color: 'var(--slate-800)', fontSize: '1rem' }}>{fac.fullName}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Designation</span>
              <strong style={{ color: 'var(--slate-800)' }}>{fac.designation}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Department</span>
              <strong style={{ color: 'var(--slate-800)' }}>{fac.department}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date of Joining</span>
              <strong style={{ color: 'var(--slate-800)' }}>{formatDate(fac.dateOfJoining)}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Highest Degree</span>
              <strong style={{ color: 'var(--slate-800)' }}>{fac.highestQualification || 'N/A'}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Institution / University</span>
              <strong style={{ color: 'var(--slate-800)' }}>{fac.university || 'N/A'} ({fac.graduationYear || 'N/A'})</strong>
            </div>

            <div>
              <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Specialization</span>
              <strong style={{ color: 'var(--slate-800)' }}>{fac.specialization || 'N/A'}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email & Phone</span>
              <strong style={{ color: 'var(--slate-800)' }}>{fac.email} {fac.phone && `• ${fac.phone}`}</strong>
            </div>
          </div>

          {fac.orcid && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.825rem', color: 'var(--slate-500)' }}>
              <strong>ORCID:</strong> {fac.orcid}
            </div>
          )}
        </div>

        {/* Section 2: Summary Metrics Table */}
        <div className="summary-section" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-800)', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="var(--primary-light)" /> 2. Academic Performance & Career Overview
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--slate-100)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Total Publications</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-light)' }}>{m.totalPublications}</div>
            </div>

            <div style={{ background: 'var(--slate-100)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Journals</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{m.journalCount}</div>
            </div>

            <div style={{ background: 'var(--slate-100)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Conferences</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>{m.conferenceCount}</div>
            </div>

            <div style={{ background: 'var(--slate-100)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Indexed (Scopus/WoS)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#3b82f6' }}>{m.scopusCount + m.wosCount}</div>
            </div>

            <div style={{ background: 'var(--slate-100)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Patents & Chapters</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#a855f7' }}>{m.patentCount + m.bookChapterCount}</div>
            </div>

            <div style={{ background: 'var(--slate-100)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Total Grants</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>{formatCurrency(m.totalFunding)}</div>
            </div>
          </div>
        </div>

        {/* Section 3: Publications Record */}
        {publications.length > 0 && (
          <div className="summary-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-800)', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color="var(--primary-light)" /> 3. Publication Record ({publications.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {publications.map((p, idx) => (
                <div key={p._id} style={{ fontSize: '0.875rem', padding: '0.75rem', background: 'var(--slate-100)', borderRadius: '6px', borderLeft: '3px solid var(--primary-light)', border: '1px solid var(--slate-200)', borderLeftWidth: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '700', color: 'var(--slate-800)' }}>
                      [{idx + 1}] {p.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>
                      {formatDate(p.publicationDate)}
                    </span>
                  </div>
                  <div style={{ color: 'var(--slate-600)', fontSize: '0.825rem' }}>
                    Authors: {Array.isArray(p.authors) ? p.authors.join(', ') : p.authors}
                  </div>
                  <div style={{ color: 'var(--slate-500)', fontSize: '0.8rem', fontStyle: 'italic', marginTop: '0.2rem' }}>
                    {p.journalName || p.conferenceName || 'Independent Record'} • {p.publicationType} • {p.indexing}
                    {p.doi && ` • DOI: ${p.doi}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Research Projects & Grants */}
        {projects.length > 0 && (
          <div className="summary-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-800)', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FolderGit2 size={18} color="var(--primary-light)" /> 4. Research & Funded Projects ({projects.length})
            </h2>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Project Title</th>
                  <th>Agency</th>
                  <th>Role</th>
                  <th>Funding (₹)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj._id}>
                    <td><strong style={{ color: 'var(--slate-800)' }}>{proj.title}</strong></td>
                    <td>{proj.fundingOrganization}</td>
                    <td>{proj.principalInvestigator}</td>
                    <td style={{ color: '#10b981', fontWeight: '700' }}>{formatCurrency(proj.fundingAmount)}</td>
                    <td><span className="badge badge-accepted">{proj.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Section 5: Professional Achievements & Awards */}
        {achievements.length > 0 && (
          <div className="summary-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-800)', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={18} color="var(--primary-light)" /> 5. Honors & Professional Achievements ({achievements.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {achievements.map((a, idx) => (
                <div key={a._id} style={{ fontSize: '0.85rem', padding: '0.65rem', background: 'var(--slate-100)', borderRadius: '6px', border: '1px solid var(--slate-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: 'var(--slate-800)' }}>{idx + 1}. {a.title}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{formatDate(a.date)}</span>
                  </div>
                  <div style={{ color: 'var(--slate-500)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    {a.organization} • Level: {a.level} • Category: {a.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: Certifications & Conferences */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {certifications.length > 0 && (
            <div className="summary-section">
              <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-800)', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                6. Certifications ({certifications.length})
              </h2>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                {certifications.map((c) => (
                  <li key={c._id} style={{ marginBottom: '0.4rem' }}>
                    <strong>{c.name}</strong> — {c.issuingOrganization} ({formatDate(c.issueDate)})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {conferences.length > 0 && (
            <div className="summary-section">
              <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-800)', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                7. Conferences & Workshops ({conferences.length})
              </h2>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                {conferences.map((ev) => (
                  <li key={ev._id} style={{ marginBottom: '0.4rem' }}>
                    <strong>{ev.eventName}</strong> — Role: {ev.role} ({ev.organizer}, {formatDate(ev.startDate)})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CareerSummary;
