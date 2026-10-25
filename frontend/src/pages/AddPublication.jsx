import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Save, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Loading from '../components/Loading';

const AddPublication = () => {
  const { id } = useParams(); // If present, edit mode
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();

  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    publicationType: 'Journal',
    journalName: '',
    conferenceName: '',
    publisher: '',
    publicationDate: new Date().toISOString().split('T')[0],
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    issn: '',
    isbn: '',
    abstract: '',
    keywords: '',
    indexing: 'Scopus',
    status: 'Published',
    url: ''
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchPub = async () => {
        try {
          const res = await api.get(`/publications/${id}`);
          if (res.data.success) {
            const pub = res.data.data;
            setFormData({
              title: pub.title || '',
              authors: Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors || '',
              publicationType: pub.publicationType || 'Journal',
              journalName: pub.journalName || '',
              conferenceName: pub.conferenceName || '',
              publisher: pub.publisher || '',
              publicationDate: pub.publicationDate ? pub.publicationDate.split('T')[0] : '',
              volume: pub.volume || '',
              issue: pub.issue || '',
              pages: pub.pages || '',
              doi: pub.doi || '',
              issn: pub.issn || '',
              isbn: pub.isbn || '',
              abstract: pub.abstract || '',
              keywords: Array.isArray(pub.keywords) ? pub.keywords.join(', ') : pub.keywords || '',
              indexing: pub.indexing || 'Scopus',
              status: pub.status || 'Published',
              url: pub.url || ''
            });
          }
        } catch (err) {
          toastError('Failed to fetch publication details');
          navigate('/publications');
        } finally {
          setLoading(false);
        }
      };
      fetchPub();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toastError('Publication title is required');
      return;
    }

    if (!formData.authors.trim()) {
      toastError('At least one author is required');
      return;
    }

    if (!formData.publicationDate) {
      toastError('Publication date is required');
      return;
    }

    try {
      setSaving(true);
      const payload = { ...formData };

      if (isEditMode) {
        const res = await api.put(`/publications/${id}`, payload);
        if (res.data.success) {
          toastSuccess('Publication updated successfully');
          navigate('/publications');
        }
      } else {
        const res = await api.post('/publications', payload);
        if (res.data.success) {
          toastSuccess('Publication added successfully');
          navigate('/publications');
        }
      }
    } catch (err) {
      console.error('Failed to save publication:', err);
      toastError(err.response?.data?.message || 'Failed to save publication record');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading message="Loading publication details..." />;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <Link
            to="/publications"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#64748b',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
              fontWeight: '600'
            }}
          >
            <ArrowLeft size={16} /> Back to Publications
          </Link>
          <h1 className="page-header-title">
            {isEditMode ? 'Edit Publication Record' : 'Add New Academic Publication'}
          </h1>
          <p className="page-header-subtitle">
            Enter publication metadata for citation indexing, career advancement, and appraisal summaries.
          </p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Section: Basic Details */}
          <div className="form-group">
            <label className="form-label" htmlFor="pub-title">
              Publication Title <span className="required">*</span>
            </label>
            <input
              id="pub-title"
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. Deep Transfer Learning Architecture for Automated Brain Tumor Segmentation"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="pub-authors">
                Authors (Comma-separated) <span className="required">*</span>
              </label>
              <input
                id="pub-authors"
                type="text"
                name="authors"
                className="form-input"
                placeholder="Rajesh Kumar, Anita Nair, Sunil Deshmukh"
                value={formData.authors}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pub-type">
                Publication Type <span className="required">*</span>
              </label>
              <select
                id="pub-type"
                name="publicationType"
                className="form-select"
                value={formData.publicationType}
                onChange={handleChange}
                required
              >
                <option value="Journal">Journal</option>
                <option value="Conference">Conference</option>
                <option value="Book Chapter">Book Chapter</option>
                <option value="Book">Book</option>
                <option value="Patent">Patent</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Section: Venue Details */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="pub-venue">
                {formData.publicationType === 'Conference'
                  ? 'Conference Name'
                  : 'Journal / Venue Name'}
              </label>
              <input
                id="pub-venue"
                type="text"
                name={formData.publicationType === 'Conference' ? 'conferenceName' : 'journalName'}
                className="form-input"
                placeholder={
                  formData.publicationType === 'Conference'
                    ? 'e.g. IEEE International Conference on Cloud Computing'
                    : 'e.g. IEEE Transactions on Medical Imaging'
                }
                value={
                  formData.publicationType === 'Conference'
                    ? formData.conferenceName
                    : formData.journalName
                }
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pub-publisher">
                Publisher
              </label>
              <input
                id="pub-publisher"
                type="text"
                name="publisher"
                className="form-input"
                placeholder="e.g. IEEE, Springer, Elsevier, Nature"
                value={formData.publisher}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section: Dates and Metrics */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label" htmlFor="pub-date">
                Publication Date <span className="required">*</span>
              </label>
              <input
                id="pub-date"
                type="date"
                name="publicationDate"
                className="form-input"
                value={formData.publicationDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pub-indexing">
                Indexing
              </label>
              <select
                id="pub-indexing"
                name="indexing"
                className="form-select"
                value={formData.indexing}
                onChange={handleChange}
              >
                <option value="Scopus">Scopus</option>
                <option value="Web of Science">Web of Science</option>
                <option value="UGC">UGC CARE</option>
                <option value="Google Scholar">Google Scholar</option>
                <option value="Other">Other</option>
                <option value="Not Indexed">Not Indexed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pub-status">
                Publication Status
              </label>
              <select
                id="pub-status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Published">Published</option>
                <option value="Accepted">Accepted</option>
                <option value="Under Review">Under Review</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Volume</label>
              <input
                type="text"
                name="volume"
                className="form-input"
                placeholder="e.g. 44"
                value={formData.volume}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Issue No.</label>
              <input
                type="text"
                name="issue"
                className="form-input"
                placeholder="e.g. 3"
                value={formData.issue}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Page Numbers</label>
              <input
                type="text"
                name="pages"
                className="form-input"
                placeholder="e.g. 1024-1036"
                value={formData.pages}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section: Identifiers */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">DOI</label>
              <input
                type="text"
                name="doi"
                className="form-input"
                placeholder="10.1109/TMI.2025.3214890"
                value={formData.doi}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">ISSN</label>
              <input
                type="text"
                name="issn"
                className="form-input"
                placeholder="0278-0062"
                value={formData.issn}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">ISBN</label>
              <input
                type="text"
                name="isbn"
                className="form-input"
                placeholder="978-0-367-54892-1"
                value={formData.isbn}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Abstract and Keywords */}
          <div className="form-group">
            <label className="form-label">Abstract</label>
            <textarea
              name="abstract"
              className="form-textarea"
              rows={4}
              placeholder="Provide a concise abstract of research objectives, methodologies, and core findings..."
              value={formData.abstract}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Keywords (Comma-separated)</label>
            <input
              type="text"
              name="keywords"
              className="form-input"
              placeholder="e.g. Medical Imaging, Deep Learning, Segmentation, MRI"
              value={formData.keywords}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Publication / Article URL</label>
            <input
              type="url"
              name="url"
              className="form-input"
              placeholder="https://ieeexplore.ieee.org/document/..."
              value={formData.url}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/publications')}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : isEditMode ? 'Update Publication' : 'Save Publication'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPublication;
