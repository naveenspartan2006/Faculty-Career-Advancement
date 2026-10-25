import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, MapPin, Users, ExternalLink, Edit2, Trash2, Tag } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';

const Conferences = () => {
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [eventType, setEventType] = useState('All');
  const [role, setRole] = useState('All');

  // Modals
  const [modal, setModal] = useState({ isOpen: false, isEdit: false, id: null, saving: false });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '', deleting: false });

  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'Conference',
    organizer: '',
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    role: 'Participant',
    description: '',
    referenceUrl: ''
  });

  const fetchConferences = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (eventType !== 'All') params.eventType = eventType;
      if (role !== 'All') params.role = role;

      const res = await api.get('/conferences', { params });
      if (res.data.success) {
        setConferences(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load conferences:', err);
      toastError('Unable to load conference and workshop records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConferences();
  }, [eventType, role]);

  const handleOpenAdd = () => {
    setFormData({
      eventName: '',
      eventType: 'Conference',
      organizer: '',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      role: 'Participant',
      description: '',
      referenceUrl: ''
    });
    setModal({ isOpen: true, isEdit: false, id: null, saving: false });
  };

  const handleOpenEdit = (item) => {
    setFormData({
      eventName: item.eventName,
      eventType: item.eventType,
      organizer: item.organizer,
      location: item.location || '',
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      role: item.role,
      description: item.description || '',
      referenceUrl: item.referenceUrl || ''
    });
    setModal({ isOpen: true, isEdit: true, id: item._id, saving: false });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.eventName.trim() || !formData.organizer.trim() || !formData.startDate) {
      toastError('Event Name, Organizer, and Start Date are required.');
      return;
    }

    try {
      setModal((prev) => ({ ...prev, saving: true }));
      if (modal.isEdit) {
        await api.put(`/conferences/${modal.id}`, formData);
        toastSuccess('Event record updated');
      } else {
        await api.post('/conferences', formData);
        toastSuccess('Event record added');
      }
      setModal({ isOpen: false, isEdit: false, id: null, saving: false });
      fetchConferences();
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to save event');
      setModal((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, deleting: true }));
      await api.delete(`/conferences/${deleteModal.id}`);
      toastSuccess('Event record deleted');
      setDeleteModal({ isOpen: false, id: null, title: '', deleting: false });
      fetchConferences();
    } catch (err) {
      toastError('Failed to delete event');
      setDeleteModal((prev) => ({ ...prev, deleting: false }));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Conferences, Workshops & FDPs</h1>
          <p className="page-header-subtitle">
            Track academic conferences, seminars, faculty development programs, and symposiums.
          </p>
        </div>

        {user?.role === 'faculty' && (
          <div className="page-actions-group">
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add Event Record</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchConferences();
          }}
          className="search-input-wrapper"
        >
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by event name, organizer, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <select
          className="filter-select"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="All">All Event Types</option>
          <option value="Conference">Conference</option>
          <option value="Workshop">Workshop</option>
          <option value="Seminar">Seminar</option>
          <option value="FDP">FDP</option>
          <option value="Webinar">Webinar</option>
          <option value="Symposium">Symposium</option>
          <option value="Other">Other</option>
        </select>

        <select
          className="filter-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Participant">Participant</option>
          <option value="Speaker">Speaker</option>
          <option value="Presenter">Presenter</option>
          <option value="Organizer">Organizer</option>
          <option value="Chairperson">Chairperson</option>
        </select>
      </div>

      {/* Events List */}
      {loading ? (
        <Loading message="Loading events and workshops..." />
      ) : conferences.length > 0 ? (
        <div>
          {conferences.map((item) => (
            <div key={item._id} className="card card-hover" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <span className="badge badge-other" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                      {item.eventType}
                    </span>
                    <span className="badge badge-national">
                      Role: {item.role}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={13} /> {formatDate(item.startDate)}
                      {item.endDate && ` – ${formatDate(item.endDate)}`}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', color: 'var(--slate-800)', fontWeight: '700', marginBottom: '0.35rem' }}>
                    {item.eventName}
                  </h3>

                  <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '0.5rem' }}>
                    <span><strong style={{ color: 'var(--slate-800)' }}>Organizer:</strong> {item.organizer}</span>
                    {item.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={13} color="var(--primary-light)" /> {item.location}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '0.5rem', lineHeight: '1.5' }}>
                      {item.description}
                    </p>
                  )}

                  {item.referenceUrl && (
                    <div>
                      <a
                        href={item.referenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#4338ca', fontWeight: '600' }}
                      >
                        <ExternalLink size={13} /> Certificate / Event Link
                      </a>
                    </div>
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
                      onClick={() => setDeleteModal({ isOpen: true, id: item._id, title: item.eventName, deleting: false })}
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
            <Calendar size={30} />
          </div>
          <h3 className="empty-title">No Events Recorded</h3>
          <p className="empty-description">
            Maintain your participation in national/international conferences, seminars, and FDPs.
          </p>
          {user?.role === 'faculty' && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Record First Event</span>
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, isEdit: false, id: null, saving: false })}
        title={modal.isEdit ? 'Edit Event Record' : 'Add Conference / Workshop'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">
              Event Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. IEEE International Conference on Advanced Computing"
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Event Type</label>
              <select
                className="form-select"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              >
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="FDP">FDP (Faculty Development Program)</option>
                <option value="Webinar">Webinar</option>
                <option value="Symposium">Symposium</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Participant">Participant</option>
                <option value="Speaker">Speaker / Keynote</option>
                <option value="Presenter">Paper Presenter</option>
                <option value="Organizer">Organizer / Coordinator</option>
                <option value="Chairperson">Session Chair / Chairperson</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                Organizer / Host Institution <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. IEEE Computer Society / NIT Trichy"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bengaluru, India (or Virtual)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
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
            <label className="form-label">Certificate / Reference URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={formData.referenceUrl}
              onChange={(e) => setFormData({ ...formData, referenceUrl: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Session Topics</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Key topics presented or workshops conducted..."
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
              {modal.saving ? 'Saving...' : modal.isEdit ? 'Update Record' : 'Save Event'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, title: '', deleting: false })}
        title="Delete Event Record"
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
          Are you sure you want to delete event record <strong style={{ color: 'var(--slate-900)' }}>"{deleteModal.title}"</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default Conferences;
