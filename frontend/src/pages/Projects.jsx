import React, { useState, useEffect } from 'react';
import { FolderGit2, Plus, Search, Calendar, DollarSign, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatCurrency } from '../utils/formatters';

const Projects = () => {
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [projectType, setProjectType] = useState('All');

  // Modals
  const [modal, setModal] = useState({ isOpen: false, isEdit: false, id: null, saving: false });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '', deleting: false });

  const [formData, setFormData] = useState({
    title: '',
    projectType: 'Research',
    fundingOrganization: '',
    principalInvestigator: user?.name || '',
    coInvestigators: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    fundingAmount: '',
    status: 'Ongoing',
    description: ''
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (status !== 'All') params.status = status;
      if (projectType !== 'All') params.projectType = projectType;

      const res = await api.get('/projects', { params });
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      toastError('Unable to load funded projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [status, projectType]);

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      projectType: 'Research',
      fundingOrganization: '',
      principalInvestigator: user?.name || '',
      coInvestigators: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      fundingAmount: '',
      status: 'Ongoing',
      description: ''
    });
    setModal({ isOpen: true, isEdit: false, id: null, saving: false });
  };

  const handleOpenEdit = (item) => {
    setFormData({
      title: item.title,
      projectType: item.projectType || 'Research',
      fundingOrganization: item.fundingOrganization,
      principalInvestigator: item.principalInvestigator,
      coInvestigators: Array.isArray(item.coInvestigators)
        ? item.coInvestigators.join(', ')
        : item.coInvestigators || '',
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      fundingAmount: item.fundingAmount || 0,
      status: item.status || 'Ongoing',
      description: item.description || ''
    });
    setModal({ isOpen: true, isEdit: true, id: item._id, saving: false });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.fundingOrganization.trim() || !formData.startDate) {
      toastError('Project Title, Funding Agency, and Start Date are required.');
      return;
    }

    try {
      setModal((prev) => ({ ...prev, saving: true }));
      const payload = {
        ...formData,
        fundingAmount: Number(formData.fundingAmount) || 0
      };

      if (modal.isEdit) {
        await api.put(`/projects/${modal.id}`, payload);
        toastSuccess('Project updated successfully');
      } else {
        await api.post('/projects', payload);
        toastSuccess('Project added successfully');
      }
      setModal({ isOpen: false, isEdit: false, id: null, saving: false });
      fetchProjects();
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to save project');
      setModal((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, deleting: true }));
      await api.delete(`/projects/${deleteModal.id}`);
      toastSuccess('Project deleted successfully');
      setDeleteModal({ isOpen: false, id: null, title: '', deleting: false });
      fetchProjects();
    } catch (err) {
      toastError('Failed to delete project');
      setDeleteModal((prev) => ({ ...prev, deleting: false }));
    }
  };

  const getStatusClass = (st) => {
    switch (st) {
      case 'Completed':
        return 'badge-published';
      case 'Ongoing':
        return 'badge-accepted';
      default:
        return 'badge-review';
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Research & Funded Projects</h1>
          <p className="page-header-subtitle">
            Maintain sponsored research grants, government funding, and industry consultancies.
          </p>
        </div>

        {user?.role === 'faculty' && (
          <div className="page-actions-group">
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add Research Project</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchProjects();
          }}
          className="search-input-wrapper"
        >
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by project title, funding agency, or PI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <select
          className="filter-select"
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
        >
          <option value="All">All Project Types</option>
          <option value="Research">Research</option>
          <option value="Consultancy">Consultancy</option>
          <option value="Institutional">Institutional</option>
          <option value="Development">Development</option>
          <option value="Other">Other</option>
        </select>

        <select
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Proposed">Proposed</option>
        </select>
      </div>

      {/* Projects List */}
      {loading ? (
        <Loading message="Loading funded projects..." />
      ) : projects.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {projects.map((item) => (
            <div key={item._id} className="card card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <span className="badge badge-other" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                      {item.projectType}
                    </span>
                    <span className={`badge ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={13} /> {formatDate(item.startDate)}
                      {item.endDate && ` – ${formatDate(item.endDate)}`}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-800)', fontWeight: '700', marginBottom: '0.35rem' }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', fontWeight: '600', marginBottom: '0.4rem' }}>
                    Funding Agency: <span style={{ color: 'var(--primary-light)' }}>{item.fundingOrganization}</span>
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '0.75rem' }}>
                    <span><strong style={{ color: 'var(--slate-800)' }}>Principal Investigator:</strong> {item.principalInvestigator}</span>
                    {item.coInvestigators && item.coInvestigators.length > 0 && (
                      <span><strong style={{ color: 'var(--slate-800)' }}>Co-Investigators:</strong> {Array.isArray(item.coInvestigators) ? item.coInvestigators.join(', ') : item.coInvestigators}</span>
                    )}
                    <span><strong style={{ color: 'var(--slate-800)' }}>Grant Value:</strong> <strong style={{ color: '#10b981' }}>{formatCurrency(item.fundingAmount)}</strong></span>
                  </div>

                  {item.description && (
                    <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                      {item.description}
                    </p>
                  )}
                </div>

                {user?.role === 'faculty' && (
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenEdit(item)}
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => setDeleteModal({ isOpen: true, id: item._id, title: item.title, deleting: false })}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FolderGit2 size={30} />
          </div>
          <h3 className="empty-title">No Funded Projects Recorded</h3>
          <p className="empty-description">
            Maintain records of sponsored research grants, AICTE, DST, or industry consultancies.
          </p>
          {user?.role === 'faculty' && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add First Research Project</span>
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, isEdit: false, id: null, saving: false })}
        title={modal.isEdit ? 'Edit Research Project' : 'Add Research / Funded Project'}
        size="lg"
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">
              Project Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Design of Privacy-Preserving Federated Healthcare Intelligence Network"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Project Type</label>
              <select
                className="form-select"
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              >
                <option value="Research">Research Grant</option>
                <option value="Consultancy">Industry Consultancy</option>
                <option value="Institutional">Institutional Seed Grant</option>
                <option value="Development">Development Project</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Proposed">Proposed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Funding Amount (INR ₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 2850000"
                value={formData.fundingAmount}
                onChange={(e) => setFormData({ ...formData, fundingAmount: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                Funding Organization / Agency <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. DST-SERB, AICTE, ISRO, Industry"
                value={formData.fundingOrganization}
                onChange={(e) => setFormData({ ...formData, fundingOrganization: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Principal Investigator (PI) <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="Dr. Rajesh Kumar"
                value={formData.principalInvestigator}
                onChange={(e) => setFormData({ ...formData, principalInvestigator: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Co-Investigators (Comma-separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Dr. Anita Nair, Dr. Sunil Deshmukh"
              value={formData.coInvestigators}
              onChange={(e) => setFormData({ ...formData, coInvestigators: e.target.value })}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                Start Date <span className="required">*</span>
              </label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Project Objectives & Scope</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Brief description of research deliverables and milestones..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setModal({ isOpen: false, isEdit: false, id: null, saving: false })}
              disabled={modal.saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={modal.saving}
            >
              {modal.saving ? 'Saving...' : modal.isEdit ? 'Update Project' : 'Save Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, title: '', deleting: false })}
        title="Delete Project"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteModal({ isOpen: false, id: null, title: '', deleting: false })}
              disabled={deleteModal.deleting}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleConfirmDelete}
              disabled={deleteModal.deleting}
            >
              {deleteModal.deleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--slate-800)' }}>
          Are you sure you want to delete project record <strong style={{ color: 'var(--slate-900)' }}>"{deleteModal.title}"</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default Projects;
