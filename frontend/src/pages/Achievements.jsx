import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Search, Filter, Trash2, Edit2, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import AchievementCard from '../components/AchievementCard';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const Achievements = () => {
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');

  // Add/Edit Modal
  const [modal, setModal] = useState({
    isOpen: false,
    isEdit: false,
    id: null,
    saving: false
  });

  // Delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    title: '',
    deleting: false
  });

  const [formData, setFormData] = useState({
    title: '',
    category: 'Award',
    description: '',
    organization: '',
    date: new Date().toISOString().split('T')[0],
    level: 'National',
    certificateNumber: '',
    verificationUrl: ''
  });

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (level !== 'All') params.level = level;

      const res = await api.get('/achievements', { params });
      if (res.data.success) {
        setAchievements(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load achievements:', err);
      toastError('Unable to load achievements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [category, level]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAchievements();
  };

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      category: 'Award',
      description: '',
      organization: '',
      date: new Date().toISOString().split('T')[0],
      level: 'National',
      certificateNumber: '',
      verificationUrl: ''
    });
    setModal({ isOpen: true, isEdit: false, id: null, saving: false });
  };

  const handleOpenEdit = (item) => {
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description || '',
      organization: item.organization,
      date: item.date ? item.date.split('T')[0] : '',
      level: item.level,
      certificateNumber: item.certificateNumber || '',
      verificationUrl: item.verificationUrl || ''
    });
    setModal({ isOpen: true, isEdit: true, id: item._id, saving: false });
  };

  const handleSaveAchievement = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.organization.trim()) {
      toastError('Title and Organization are required.');
      return;
    }

    try {
      setModal((prev) => ({ ...prev, saving: true }));
      if (modal.isEdit) {
        const res = await api.put(`/achievements/${modal.id}`, formData);
        if (res.data.success) {
          toastSuccess('Achievement updated successfully');
          setModal({ isOpen: false, isEdit: false, id: null, saving: false });
          fetchAchievements();
        }
      } else {
        const res = await api.post('/achievements', formData);
        if (res.data.success) {
          toastSuccess('Achievement added successfully');
          setModal({ isOpen: false, isEdit: false, id: null, saving: false });
          fetchAchievements();
        }
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to save achievement');
      setModal((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleOpenDelete = (id, title) => {
    setDeleteModal({ isOpen: true, id, title, deleting: false });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, deleting: true }));
      const res = await api.delete(`/achievements/${deleteModal.id}`);
      if (res.data.success) {
        toastSuccess('Achievement deleted successfully');
        setDeleteModal({ isOpen: false, id: null, title: '', deleting: false });
        fetchAchievements();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete achievement');
      setDeleteModal((prev) => ({ ...prev, deleting: false }));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Career Achievements & Honors</h1>
          <p className="page-header-subtitle">
            Record academic honors, institutional fellowships, teaching excellence, and awards.
          </p>
        </div>

        {user?.role === 'faculty' && (
          <div className="page-actions-group">
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add Achievement</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, organization, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Award">Award</option>
          <option value="Research">Research</option>
          <option value="Teaching">Teaching</option>
          <option value="Innovation">Innovation</option>
          <option value="Academic">Academic</option>
          <option value="Professional">Professional</option>
          <option value="Other">Other</option>
        </select>

        <select
          className="filter-select"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="All">All Levels</option>
          <option value="International">International</option>
          <option value="National">National</option>
          <option value="State">State</option>
          <option value="Department">Department</option>
          <option value="Institution">Institution</option>
        </select>
      </div>

      {/* Achievements List */}
      {loading ? (
        <Loading message="Loading achievements..." />
      ) : achievements.length > 0 ? (
        <div>
          {achievements.map((item) => (
            <AchievementCard
              key={item._id}
              achievement={item}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              canModify={user?.role === 'faculty'}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Trophy size={30} />
          </div>
          <h3 className="empty-title">No Achievements Found</h3>
          <p className="empty-description">
            {search || category !== 'All' || level !== 'All'
              ? 'No records match your selected filters.'
              : 'You have not recorded any achievements yet. Click "Add Achievement" to log awards & honors.'}
          </p>
          {user?.role === 'faculty' && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Record First Achievement</span>
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, isEdit: false, id: null, saving: false })}
        title={modal.isEdit ? 'Edit Achievement Record' : 'Add New Achievement'}
      >
        <form onSubmit={handleSaveAchievement}>
          <div className="form-group">
            <label className="form-label">
              Achievement Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Distinguished Faculty Researcher Award 2024"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Award">Award</option>
                <option value="Research">Research</option>
                <option value="Teaching">Teaching</option>
                <option value="Innovation">Innovation</option>
                <option value="Academic">Academic</option>
                <option value="Professional">Professional</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Level</label>
              <select
                className="form-select"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              >
                <option value="Institution">Institution</option>
                <option value="Department">Department</option>
                <option value="State">State</option>
                <option value="National">National</option>
                <option value="International">International</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                Conferred by / Organization <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. International Association of CS & IT"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Date <span className="required">*</span>
              </label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Certificate / Reference Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. IACSIT-RES-2024-8821"
                value={formData.certificateNumber}
                onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Verification URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={formData.verificationUrl}
                onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Citation</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Provide a brief summary of the recognition..."
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
              {modal.saving ? 'Saving...' : modal.isEdit ? 'Update Achievement' : 'Save Achievement'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, title: '', deleting: false })}
        title="Delete Achievement"
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
          Are you sure you want to delete achievement <strong style={{ color: 'var(--slate-900)' }}>"{deleteModal.title}"</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default Achievements;
