import React, { useState, useEffect } from 'react';
import {
  User,
  Building2,
  GraduationCap,
  Link2,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import ProfileCard from '../components/ProfileCard';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { faculty, refreshFaculty } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Prefer not to say',
    department: '',
    designation: '',
    dateOfJoining: '',
    highestQualification: '',
    specialization: '',
    researchInterests: '',
    university: '',
    graduationYear: '',
    orcid: '',
    googleScholar: '',
    linkedin: '',
    biography: ''
  });

  useEffect(() => {
    if (faculty) {
      setFormData({
        fullName: faculty.fullName || '',
        employeeId: faculty.employeeId || '',
        email: faculty.email || '',
        phone: faculty.phone || '',
        dateOfBirth: faculty.dateOfBirth ? faculty.dateOfBirth.split('T')[0] : '',
        gender: faculty.gender || 'Prefer not to say',
        department: faculty.department || '',
        designation: faculty.designation || '',
        dateOfJoining: faculty.dateOfJoining ? faculty.dateOfJoining.split('T')[0] : '',
        highestQualification: faculty.highestQualification || '',
        specialization: faculty.specialization || '',
        researchInterests: Array.isArray(faculty.researchInterests)
          ? faculty.researchInterests.join(', ')
          : faculty.researchInterests || '',
        university: faculty.university || '',
        graduationYear: faculty.graduationYear || '',
        orcid: faculty.orcid || '',
        googleScholar: faculty.googleScholar || '',
        linkedin: faculty.linkedin || '',
        biography: faculty.biography || ''
      });
    }
  }, [faculty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/faculty/profile', formData);
      if (res.data.success) {
        toastSuccess('Profile updated successfully!');
        await refreshFaculty();
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      toastError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Faculty Academic Profile</h1>
          <p className="page-header-subtitle">
            Maintain your institutional credentials, research interests, and scholarly identifiers.
          </p>
        </div>
      </div>

      {/* Live Profile Card Preview */}
      <ProfileCard faculty={faculty} />

      {/* Profile Form with Tabs */}
      <div className="card">
        <div className="tabs-header">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Details
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'professional' ? 'active' : ''}`}
            onClick={() => setActiveTab('professional')}
          >
            Professional Details
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('academic')}
          >
            Academic Qualifications
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'research' ? 'active' : ''}`}
            onClick={() => setActiveTab('research')}
          >
            Research & Scholarly Profiles
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* TAB 1: Personal Details */}
          {activeTab === 'personal' && (
            <div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Employee ID <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    className="form-input"
                    value={formData.employeeId}
                    disabled
                    title="Employee ID cannot be changed"
                    style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    disabled
                    style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-input"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Professional Details */}
          {activeTab === 'professional' && (
            <div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    name="department"
                    className="form-select"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                    <option value="Computer Science and Design">Computer Science and Design</option>
                    <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Applied Sciences & Humanities">Applied Sciences & Humanities</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <select
                    name="designation"
                    className="form-select"
                    value={formData.designation}
                    onChange={handleChange}
                  >
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Professor">Professor</option>
                    <option value="Head of Department">Head of Department</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Date of Joining Institution</label>
                  <input
                    type="date"
                    name="dateOfJoining"
                    className="form-input"
                    value={formData.dateOfJoining}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    className="form-input"
                    placeholder="e.g. Distributed Artificial Intelligence"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Biography / Career Overview</label>
                <textarea
                  name="biography"
                  className="form-textarea"
                  rows={4}
                  placeholder="Summarize your teaching background, key milestones, and scholarly contributions..."
                  value={formData.biography}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* TAB 3: Academic Qualifications */}
          {activeTab === 'academic' && (
            <div>
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Highest Degree</label>
                  <input
                    type="text"
                    name="highestQualification"
                    className="form-input"
                    placeholder="e.g. Ph.D. in Computer Science"
                    value={formData.highestQualification}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">University / Institute</label>
                  <input
                    type="text"
                    name="university"
                    className="form-input"
                    placeholder="e.g. IIT Madras"
                    value={formData.university}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Year of Completion</label>
                  <input
                    type="number"
                    name="graduationYear"
                    className="form-input"
                    placeholder="e.g. 2012"
                    value={formData.graduationYear}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Research & Scholarly Profiles */}
          {activeTab === 'research' && (
            <div>
              <div className="form-group">
                <label className="form-label">
                  Research Interests (Comma-separated)
                </label>
                <input
                  type="text"
                  name="researchInterests"
                  className="form-input"
                  placeholder="e.g. Machine Learning, Cloud Computing, Edge Intelligence"
                  value={formData.researchInterests}
                  onChange={handleChange}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Enter areas separated by commas to format as tags.
                </span>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">ORCID iD</label>
                  <input
                    type="text"
                    name="orcid"
                    className="form-input"
                    placeholder="0000-0002-1825-0097"
                    value={formData.orcid}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Google Scholar URL</label>
                  <input
                    type="url"
                    name="googleScholar"
                    className="form-input"
                    placeholder="https://scholar.google.com/citations?user=..."
                    value={formData.googleScholar}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    name="linkedin"
                    className="form-input"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
