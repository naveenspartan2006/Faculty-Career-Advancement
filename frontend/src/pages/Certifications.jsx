import React, { useState, useEffect } from 'react';
import { Award, Plus, Calendar, ExternalLink, Edit2, Trash2, Search, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';

const Certifications = () => {
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [modal, setModal] = useState({ isOpen: false, isEdit: false, id: null, saving: false });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '', deleting: false });

  const [formData, setFormData] = useState({
    name: '',
    issuingOrganization: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    description: ''
  });

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      const res = await api.get('/certifications', { params });
      if (res.data.success) {
        setCertifications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load certifications:', err);
      toastError('Unable to load certifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      issuingOrganization: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      description: ''
    });
    setModal({ isOpen: true, isEdit: false, id: null, saving: false });
  };

  const handleOpenEdit = (item) => {
    setFormData({
      name: item.name,
      issuingOrganization: item.issuingOrganization,
      issueDate: item.issueDate ? item.issueDate.split('T')[0] : '',
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
      credentialId: item.credentialId || '',
      credentialUrl: item.credentialUrl || '',
      description: item.description || ''
    });
    setModal({ isOpen: true, isEdit: true, id: item._id, saving: false });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.issuingOrganization.trim()) {
      toastError('Name and Issuing Organization are required.');
      return;
    }

    try {
      setModal((prev) => ({ ...prev, saving: true }));
      if (modal.isEdit) {
        await api.put(`/certifications/${modal.id}`, formData);
        toastSuccess('Certification updated successfully');
      } else {
        await api.post('/certifications', formData);
        toastSuccess('Certification added successfully');
      }
      setModal({ isOpen: false, isEdit: false, id: null, saving: false });
      fetchCertifications();
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to save certification');
      setModal((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, deleting: true }));
      await api.delete(`/certifications/${deleteModal.id}`);
      toastSuccess('Certification deleted successfully');
      setDeleteModal({ isOpen: false, id: null, name: '', deleting: false });
      fetchCertifications();
    } catch (err) {
      toastError('Failed to delete certification');
      setDeleteModal((prev) => ({ ...prev, deleting: false }));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Professional Certifications</h1>
          <p className="page-header-subtitle">
            Manage industry certifications, technical qualifications, and academic credentials.
          </p>
        </div>

        {user?.role === 'faculty' && (
          <div className="page-actions-group">
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add Certification</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="filter-bar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCertifications();
          }}
          className="search-input-wrapper"
        >
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by certification name, issuing org, or credential ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      {/* Certifications Grid */}
      {loading ? (
        <Loading message="Loading certifications..." />
      ) : certifications.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {certifications.map((cert) => (
            <div key={cert._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: '#f5f3ff',
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Award size={22} />
                </div>

                {user?.role === 'faculty' && (
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenEdit(cert)}
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => setDeleteModal({ isOpen: true, id: cert._id, name: cert.name, deleting: false })}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: '1.05rem', color: 'var(--slate-800)', fontWeight: '700', marginBottom: '0.35rem' }}>
                {cert.name}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: '600', marginBottom: '0.5rem' }}>
                {cert.issuingOrganization}
              </p>

              {cert.description && (
                <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginBottom: '0.85rem', flex: 1, lineHeight: '1.5' }}>
                  {cert.description}
                </p>
              )}

              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--slate-200)', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Issued: <strong style={{ color: 'var(--slate-800)' }}>{formatDate(cert.issueDate)}</strong></span>
                  {cert.expiryDate && <span>Expires: {formatDate(cert.expiryDate)}</span>}
                </div>

                {cert.credentialId && (
                  <div style={{ marginTop: '0.35rem' }}>
                    ID: <code>{cert.credentialId}</code>
                  </div>
                )}

                {cert.credentialUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#4338ca', fontWeight: '600' }}
                    >
                      <ExternalLink size={13} /> Verify Credential
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Award size={30} />
          </div>
          <h3 className="empty-title">No Certifications Recorded</h3>
          <p className="empty-description">
            Add your professional development credentials, cloud certifications, and technical accreditations.
          </p>
          {user?.role === 'faculty' && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add First Certification</span>
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, isEdit: false, id: null, saving: false })}
        title={modal.isEdit ? 'Edit Certification' : 'Add New Certification'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">
              Certification Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. AWS Certified Solutions Architect – Professional"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Issuing Organization <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Amazon Web Services / NPTEL"
              value={formData.issuingOrganization}
              onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                Issue Date <span className="required">*</span>
              </label>
              <input
                type="date"
                className="form-input"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expiry Date (If applicable)</label>
              <input
                type="date"
                className="form-input"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Credential ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AWS-PSA-994821"
                value={formData.credentialId}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Credential / Verification URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={formData.credentialUrl}
                onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Scope</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Brief description of skills tested and certified..."
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
              {modal.saving ? 'Saving...' : modal.isEdit ? 'Update Certification' : 'Save Certification'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, name: '', deleting: false })}
        title="Delete Certification"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteModal({ isOpen: false, id: null, name: '', deleting: false })}
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
          Are you sure you want to delete certification <strong style={{ color: 'var(--slate-900)' }}>"{deleteModal.name}"</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default Certifications;
