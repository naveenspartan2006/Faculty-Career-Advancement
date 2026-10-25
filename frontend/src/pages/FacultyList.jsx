import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Building2,
  BookOpen,
  FileSpreadsheet,
  BarChart3,
  ExternalLink,
  Eye,
  GraduationCap
} from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import ProfileCard from '../components/ProfileCard';

const FacultyList = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [designation, setDesignation] = useState('All');

  // Profile inspect modal
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (department !== 'All') params.department = department;
      if (designation !== 'All') params.designation = designation;

      const res = await api.get('/admin/faculty', { params });
      if (res.data.success) {
        setFacultyList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load faculty directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [department, designation]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Faculty Directory & Records</h1>
          <p className="page-header-subtitle">
            Inspect individual faculty portfolios, generated career summaries, and research output.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchFaculty();
          }}
          className="search-input-wrapper"
        >
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, employee ID, specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <select
          className="filter-select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="Computer Science and Engineering">Computer Science and Engineering</option>
          <option value="Computer Science and Design">Computer Science and Design</option>
          <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
          <option value="Information Technology">Information Technology</option>
        </select>

        <select
          className="filter-select"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        >
          <option value="All">All Designations</option>
          <option value="Professor">Professor</option>
          <option value="Associate Professor">Associate Professor</option>
          <option value="Assistant Professor">Assistant Professor</option>
          <option value="Head of Department">Head of Department</option>
        </select>
      </div>

      {/* Faculty Directory Table */}
      {loading ? (
        <Loading message="Loading faculty directory..." />
      ) : facultyList.length > 0 ? (
        <div className="table-container">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Faculty Member</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th style={{ textAlign: 'center' }}>Publications</th>
                  <th style={{ textAlign: 'center' }}>Projects</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {facultyList.map((fac) => (
                  <tr key={fac._id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--slate-800)' }}>{fac.fullName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{fac.email}</div>
                    </td>
                    <td>
                      <code style={{ background: 'var(--slate-200)', color: 'var(--slate-800)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                        {fac.employeeId}
                      </code>
                    </td>
                    <td>{fac.department}</td>
                    <td>
                      <span className="badge badge-other" style={{ fontWeight: '600' }}>
                        {fac.designation}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <strong style={{ color: '#4338ca', fontSize: '1rem' }}>
                        {fac.counts?.publications || 0}
                      </strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <strong style={{ color: '#059669', fontSize: '1rem' }}>
                        {fac.counts?.projects || 0}
                      </strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedFaculty(fac)}
                          title="View Profile"
                        >
                          <Eye size={14} />
                          <span>Profile</span>
                        </button>
                        <Link
                          to={`/career-summary?facultyId=${fac._id}`}
                          className="btn btn-secondary btn-sm"
                          title="Career Summary"
                        >
                          <FileSpreadsheet size={14} />
                          <span>Summary</span>
                        </Link>
                        <Link
                          to={`/publication-summary?facultyId=${fac._id}`}
                          className="btn btn-secondary btn-sm"
                          title="Publication Analytics"
                        >
                          <BarChart3 size={14} />
                          <span>Metrics</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Users size={30} />
          </div>
          <h3 className="empty-title">No Faculty Found</h3>
          <p className="empty-description">
            No registered faculty members matched the chosen search or department criteria.
          </p>
        </div>
      )}

      {/* Inspect Profile Modal */}
      <Modal
        isOpen={Boolean(selectedFaculty)}
        onClose={() => setSelectedFaculty(null)}
        title="Faculty Academic Profile"
        size="lg"
      >
        {selectedFaculty && <ProfileCard faculty={selectedFaculty} />}
      </Modal>
    </div>
  );
};

export default FacultyList;
