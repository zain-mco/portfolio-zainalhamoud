import { useState, useEffect } from 'react';
import { aboutAPI } from '../services/api';

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [description, setDescription] = useState('');
  const [experienceForm, setExperienceForm] = useState({ title: '', company: '', duration: '', location: '', responsibilities: [''], order: 0 });
  const [educationForm, setEducationForm] = useState({ degree: '', institution: '', duration: '', description: '', order: 0 });
  const [certificationForm, setCertificationForm] = useState({ name: '', issuer: '', link: '', image: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState('');

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const data = await aboutAPI.get();
      setAboutData(data);
      setDescription(data.description || '');
    } catch (err) {
      setError('Failed to fetch about data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, msg) => {
    if (type === 'success') {
      setSuccess(msg);
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(msg);
      setSuccess('');
    }
  };

  // Description handlers
  const handleUpdateDescription = async () => {
    try {
      await aboutAPI.update({ description });
      showMessage('success', 'Description updated successfully!');
      fetchAbout();
    } catch (err) {
      showMessage('error', 'Failed to update description: ' + err.message);
    }
  };

  // Experience handlers
  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      await aboutAPI.addExperience(experienceForm);
      showMessage('success', 'Experience added successfully!');
      setExperienceForm({ title: '', company: '', duration: '', location: '', responsibilities: [''], order: 0 });
      fetchAbout();
    } catch (err) {
      showMessage('error', 'Failed to add experience: ' + err.message);
    }
  };

  const handleUpdateExperience = async (e) => {
    e.preventDefault();
    try {
      await aboutAPI.updateExperience(editingId, experienceForm);
      showMessage('success', 'Experience updated successfully!');
      setExperienceForm({ title: '', company: '', duration: '', location: '', responsibilities: [''], order: 0 });
      setEditingId(null);
      setEditingType('');
      fetchAbout();
    } catch (err) {
      showMessage('error', 'Failed to update experience: ' + err.message);
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      await aboutAPI.deleteExperience(id);
      showMessage('success', 'Experience deleted successfully!');
      fetchAbout();
    } catch (err) {
      showMessage('error', 'Failed to delete experience: ' + err.message);
    }
  };

  const startEditExperience = (exp) => {
    setEditingId(exp._id);
    setEditingType('experience');
    setExperienceForm({
      title: exp.title,
      company: exp.company,
      duration: exp.duration,
      location: exp.location,
      responsibilities: exp.responsibilities || [''],
      order: exp.order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Education handlers
  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      await aboutAPI.addEducation(educationForm);
      showMessage('success', 'Education added successfully!');
      setEducationForm({ degree: '', institution: '', duration: '', description: '', order: 0 });
      fetchAbout();
    } catch (err) {
      showMessage('error', 'Failed to add education: ' + err.message);
    }
  };

  const handleUpdateEducation = async (e) => {
    e.preventDefault();
    try {
      await aboutAPI.updateEducation(editingId, educationForm);
      showMessage('success', 'Education updated successfully!');
      setEducationForm({ degree: '', institution: '', duration: '', description: '', order: 0 });
      setEditingId(null);
      setEditingType('');
      fetchAbout();
    } catch (err) {
      showMessage('error', 'Failed to update education: ' + err.message);
    }
  };

  const handleDeleteEducation = async (id) => {
    if (!confirm('Are you sure you want to delete this education?')) return;
    try {
      await aboutAPI.deleteEducation(id);
      showMessage('success', 'Education deleted successfully!');
      fetchAbout();
    } catch (err) {
      showMessage('error', 'Failed to delete education: ' + err.message);
    }
  };

  const startEditEducation = (edu) => {
    setEditingId(edu._id);
    setEditingType('education');
    setEducationForm({
      degree: edu.degree,
      institution: edu.institution,
      duration: edu.duration,
      description: edu.description || '',
      order: edu.order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Certification handlers
  const handleAddCertification = async (e) => {
    e.preventDefault();
    try {
      await aboutAPI.addCertification(certificationForm);
      showMessage('success', 'Certification added successfully!');
      setCertificationForm({ name: '', issuer: '', link: '', image: '' });
      fetchAbout();
    } catch (err) {
      showMessage('error', 'Failed to add certification: ' + err.message);
    }
  };

  const handleUpdateCertification = async (e) => {
    e.preventDefault();
    try {
      await aboutAPI.updateCertification(editingId, certificationForm);
      showMessage('success', 'Certification updated successfully!');
      setCertificationForm({ name: '', issuer: '', link: '', image: '' });
      setEditingId(null);
      setEditingType('');
      fetchAbout();
    } catch (err) {
      showMessage('error', 'Failed to update certification: ' + err.message);
    }
  };

  const handleDeleteCertification = async (id) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    try {
      await aboutAPI.deleteCertification(id);
      showMessage('success', 'Certification deleted successfully!');
      fetchAbout();
    } catch (err) {
      showMessage('error', 'Failed to delete certification: ' + err.message);
    }
  };

  const startEditCertification = (cert) => {
    setEditingId(cert._id);
    setEditingType('certification');
    setCertificationForm({
      name: cert.name,
      issuer: cert.issuer,
      link: cert.link || '',
      image: cert.image || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingType('');
    setExperienceForm({ title: '', company: '', duration: '', location: '', responsibilities: [''], order: 0 });
    setEducationForm({ degree: '', institution: '', duration: '', description: '', order: 0 });
    setCertificationForm({ name: '', issuer: '', link: '', image: '' });
  };

  const addResponsibility = () => {
    setExperienceForm({
      ...experienceForm,
      responsibilities: [...experienceForm.responsibilities, '']
    });
  };

  const removeResponsibility = (index) => {
    const newResponsibilities = experienceForm.responsibilities.filter((_, i) => i !== index);
    setExperienceForm({
      ...experienceForm,
      responsibilities: newResponsibilities.length > 0 ? newResponsibilities : ['']
    });
  };

  const updateResponsibility = (index, value) => {
    const newResponsibilities = [...experienceForm.responsibilities];
    newResponsibilities[index] = value;
    setExperienceForm({
      ...experienceForm,
      responsibilities: newResponsibilities
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">About Section Management</h1>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['description', 'experience', 'education', 'certifications'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Description Tab */}
      {activeTab === 'description' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">About Description</h2>
          <div className="space-y-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[200px]"
              placeholder="Enter about description..."
            />
            <button onClick={handleUpdateDescription} className="btn-primary">
              Update Description
            </button>
          </div>
        </div>
      )}

      {/* Experience Tab */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          {/* Experience Form */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">
              {editingType === 'experience' ? 'Edit Experience' : 'Add New Experience'}
            </h2>
            <form onSubmit={editingType === 'experience' ? handleUpdateExperience : handleAddExperience} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  value={experienceForm.title}
                  onChange={(e) => setExperienceForm({...experienceForm, title: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <input
                  type="text"
                  value={experienceForm.company}
                  onChange={(e) => setExperienceForm({...experienceForm, company: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    value={experienceForm.duration}
                    onChange={(e) => setExperienceForm({...experienceForm, duration: e.target.value})}
                    className="input-field"
                    placeholder="e.g., Jan 2020 - Dec 2022"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    value={experienceForm.location}
                    onChange={(e) => setExperienceForm({...experienceForm, location: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={experienceForm.order}
                  onChange={(e) => setExperienceForm({...experienceForm, order: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                {experienceForm.responsibilities.map((resp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => updateResponsibility(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`Responsibility ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeResponsibility(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addResponsibility}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Responsibility
                </button>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  {editingType === 'experience' ? 'Update Experience' : 'Add Experience'}
                </button>
                {editingType === 'experience' && (
                  <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Experience List */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Work Experience List</h2>
            {aboutData?.workExperience?.length > 0 ? (
              <div className="space-y-4">
                {aboutData.workExperience.sort((a, b) => a.order - b.order).map((exp) => (
                  <div key={exp._id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{exp.title}</h3>
                        <p className="text-gray-600">{exp.company} • {exp.location}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                        {exp.responsibilities?.length > 0 && (
                          <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                            {exp.responsibilities.slice(0, 2).map((resp, idx) => (
                              <li key={idx}>{resp}</li>
                            ))}
                            {exp.responsibilities.length > 2 && (
                              <li className="text-gray-500">+ {exp.responsibilities.length - 2} more...</li>
                            )}
                          </ul>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEditExperience(exp)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(exp._id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No work experience added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Education Tab */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          {/* Education Form */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">
              {editingType === 'education' ? 'Edit Education' : 'Add New Education'}
            </h2>
            <form onSubmit={editingType === 'education' ? handleUpdateEducation : handleAddEducation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
                <input
                  type="text"
                  value={educationForm.degree}
                  onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
                <input
                  type="text"
                  value={educationForm.institution}
                  onChange={(e) => setEducationForm({...educationForm, institution: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                <input
                  type="text"
                  value={educationForm.duration}
                  onChange={(e) => setEducationForm({...educationForm, duration: e.target.value})}
                  className="input-field"
                  placeholder="e.g., 2015 - 2019"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={educationForm.description}
                  onChange={(e) => setEducationForm({...educationForm, description: e.target.value})}
                  className="input-field"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={educationForm.order}
                  onChange={(e) => setEducationForm({...educationForm, order: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  {editingType === 'education' ? 'Update Education' : 'Add Education'}
                </button>
                {editingType === 'education' && (
                  <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Education List */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Education List</h2>
            {aboutData?.education?.length > 0 ? (
              <div className="space-y-4">
                {aboutData.education.sort((a, b) => a.order - b.order).map((edu) => (
                  <div key={edu._id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.duration}</p>
                        {edu.description && (
                          <p className="mt-2 text-sm text-gray-700">{edu.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEditEducation(edu)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEducation(edu._id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No education added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Certifications Tab */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          {/* Certification Form */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">
              {editingType === 'certification' ? 'Edit Certification' : 'Add New Certification'}
            </h2>
            <form onSubmit={editingType === 'certification' ? handleUpdateCertification : handleAddCertification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name *</label>
                <input
                  type="text"
                  value={certificationForm.name}
                  onChange={(e) => setCertificationForm({...certificationForm, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issuer *</label>
                <input
                  type="text"
                  value={certificationForm.issuer}
                  onChange={(e) => setCertificationForm({...certificationForm, issuer: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="url"
                  value={certificationForm.link}
                  onChange={(e) => setCertificationForm({...certificationForm, link: e.target.value})}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={certificationForm.image}
                  onChange={(e) => setCertificationForm({...certificationForm, image: e.target.value})}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  {editingType === 'certification' ? 'Update Certification' : 'Add Certification'}
                </button>
                {editingType === 'certification' && (
                  <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Certifications List */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Certifications List</h2>
            {aboutData?.certifications?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutData.certifications.map((cert) => (
                  <div key={cert._id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {cert.image && (
                          <img src={cert.image} alt={cert.name} className="w-16 h-16 object-cover rounded mb-2" />
                        )}
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                        {cert.link && (
                          <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                            View Certificate
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEditCertification(cert)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCertification(cert._id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No certifications added yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
