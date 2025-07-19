import React, { useState, useEffect } from 'react';
import api from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const PopupAdmin = () => {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPopup, setEditingPopup] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    affiliation: '',
    description: '',
    displayDelay: 5,
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/popup');
      setPopups(response.data);
    } catch (error) {
      console.error('Error fetching popups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      speaker: '',
      affiliation: '',
      description: '',
      displayDelay: 5,
      isActive: true
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingPopup(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingPopup) {
        await api.put(`/api/popup/${editingPopup.id}`, formDataToSend);
      } else {
        await api.post('/api/popup', formDataToSend);
      }

      resetForm();
      fetchPopups();
    } catch (error) {
      console.error('Error saving popup:', error);
    }
  };

  const handleEdit = (popup) => {
    setEditingPopup(popup);
    setFormData({
      title: popup.title,
      speaker: popup.speaker,
      affiliation: popup.affiliation,
      description: popup.description || '',
      displayDelay: popup.displayDelay,
      isActive: popup.isActive
    });
    setImagePreview(popup.id ? `${API_BASE}/api/popup/${popup.id}/image` : null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this popup?')) {
      try {
        await api.delete(`/api/popup/${id}`);
        fetchPopups();
      } catch (error) {
        console.error('Error deleting popup:', error);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/api/popup/${id}/toggle`);
      fetchPopups();
    } catch (error) {
      console.error('Error toggling popup status:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading popups..." />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Popup Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Add New Popup
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingPopup ? 'Edit Popup' : 'Create New Popup'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaker
                </label>
                <input
                  type="text"
                  name="speaker"
                  value={formData.speaker}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Affiliation
                </label>
                <input
                  type="text"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Delay (seconds)
                </label>
                <input
                  type="number"
                  name="displayDelay"
                  value={formData.displayDelay}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional description for the popup..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speaker Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Active (show to visitors)
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {editingPopup ? 'Update Popup' : 'Create Popup'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Popups List */}
      {popups.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No Popups Yet"
          message="Create your first popup to engage visitors with important announcements or events."
        />
      ) : (
        <div className="grid gap-6">
          {popups.map((popup) => (
            <div
              key={popup.id}
              className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {popup.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        popup.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {popup.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Speaker</p>
                      <p className="font-semibold">{popup.speaker}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Affiliation</p>
                      <p className="font-semibold">{popup.affiliation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Display Delay</p>
                      <p className="font-semibold">{popup.displayDelay} seconds</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-semibold">
                        {new Date(popup.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {popup.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="text-gray-800">{popup.description}</p>
                    </div>
                  )}

                  {popup.id && (
                    <div className="mb-4">
                      <img
                        src={`${API_BASE}/api/popup/${popup.id}/image`}
                        alt={popup.speaker}
                        className="w-24 h-24 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(popup)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(popup.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      popup.isActive
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {popup.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(popup.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopupAdmin; 