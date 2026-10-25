import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';
import PublicationCard from '../components/PublicationCard';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const Publications = () => {
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const navigate = useNavigate();

  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [indexing, setIndexing] = useState('All');
  const [status, setStatus] = useState('All');
  const [year, setYear] = useState('All');
  const [sort, setSort] = useState('-publicationDate');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    title: '',
    deleting: false
  });

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const params = {
        sort,
        limit: 50
      };
      if (search.trim()) params.search = search.trim();
      if (type !== 'All') params.publicationType = type;
      if (indexing !== 'All') params.indexing = indexing;
      if (status !== 'All') params.status = status;
      if (year !== 'All') params.year = year;

      const res = await api.get('/publications', { params });
      if (res.data.success) {
        setPublications(res.data.data);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error('Failed to load publications:', err);
      toastError('Unable to load publications. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [type, indexing, status, year, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPublications();
  };

  const handleOpenDelete = (id, title) => {
    setDeleteModal({
      isOpen: true,
      id,
      title,
      deleting: false
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, deleting: true }));
      const res = await api.delete(`/publications/${deleteModal.id}`);
      if (res.data.success) {
        toastSuccess('Publication deleted successfully');
        setDeleteModal({ isOpen: false, id: null, title: '', deleting: false });
        fetchPublications();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete publication');
      setDeleteModal((prev) => ({ ...prev, deleting: false }));
    }
  };

  const handleEdit = (pub) => {
    navigate(`/publications/edit/${pub._id}`, { state: { publication: pub } });
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 12 }, (_, i) => currentYear - i);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Publication Management</h1>
          <p className="page-header-subtitle">
            Maintain your journal papers, conferences, book chapters, and patents.
          </p>
        </div>

        {user?.role === 'faculty' && (
          <div className="page-actions-group">
            <Link to="/publications/add" className="btn btn-primary">
              <Plus size={16} />
              <span>Add Publication</span>
            </Link>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, author, journal, or DOI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <select
          className="filter-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Filter by publication type"
        >
          <option value="All">All Types</option>
          <option value="Journal">Journal</option>
          <option value="Conference">Conference</option>
          <option value="Book Chapter">Book Chapter</option>
          <option value="Book">Book</option>
          <option value="Patent">Patent</option>
          <option value="Other">Other</option>
        </select>

        <select
          className="filter-select"
          value={indexing}
          onChange={(e) => setIndexing(e.target.value)}
          aria-label="Filter by indexing"
        >
          <option value="All">All Indexing</option>
          <option value="Scopus">Scopus</option>
          <option value="Web of Science">Web of Science</option>
          <option value="UGC">UGC</option>
          <option value="Google Scholar">Google Scholar</option>
          <option value="Other">Other</option>
          <option value="Not Indexed">Not Indexed</option>
        </select>

        <select
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="All">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Accepted">Accepted</option>
          <option value="Under Review">Under Review</option>
          <option value="In Progress">In Progress</option>
        </select>

        <select
          className="filter-select"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          aria-label="Filter by year"
        >
          <option value="All">All Years</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort publications"
        >
          <option value="-publicationDate">Newest First</option>
          <option value="publicationDate">Oldest First</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>

      {/* Publications List */}
      {loading ? (
        <Loading message="Fetching publication records..." />
      ) : publications.length > 0 ? (
        <div>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
            Showing <strong>{publications.length}</strong> of <strong>{total}</strong> publications
          </div>

          {publications.map((pub) => (
            <PublicationCard
              key={pub._id}
              publication={pub}
              onEdit={handleEdit}
              onDelete={handleOpenDelete}
              canModify={user?.role === 'faculty'}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <BookOpen size={30} />
          </div>
          <h3 className="empty-title">No Publications Found</h3>
          <p className="empty-description">
            {search || type !== 'All' || indexing !== 'All'
              ? 'No publications matched your search filters. Try clearing your search parameters.'
              : 'You have not added any publications yet. Click the button below to add your research papers.'}
          </p>
          {user?.role === 'faculty' && (
            <Link to="/publications/add" className="btn btn-primary">
              <Plus size={16} />
              <span>Add Your First Publication</span>
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, title: '', deleting: false })}
        title="Confirm Publication Deletion"
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
              {deleteModal.deleting ? 'Deleting...' : 'Delete Publication'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <p style={{ color: 'var(--slate-800)', fontWeight: '600', marginBottom: '0.35rem' }}>
              Are you sure you want to delete this publication?
            </p>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
              "{deleteModal.title}"
            </p>
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              This action cannot be undone and will update your dashboard statistics and summaries.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Publications;
