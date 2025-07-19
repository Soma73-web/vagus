import React, { useEffect, useState } from 'react';
import api from '../../api'; // axios instance

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

const GalleryAdmin = () => {
  const [gallery, setGallery] = useState([]);
  const [form, setForm] = useState({ id: null, title: '', image: null });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await api.get('/api/gallery');
      setGallery(res.data || []);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
      alert('Failed to load gallery');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const file = files?.[0] || null;

    setForm((prev) => ({
      ...prev,
      [name]: file || value,
    }));

    if (name === 'image' && file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    if (form.image) formData.append('image', form.image);

    try {
      if (form.id) {
        await api.put(`/api/gallery/${form.id}`, formData);
      } else {
        await api.post('/api/gallery', formData);
      }
      fetchGallery();
      resetForm();
    } catch (err) {
      console.error('Error submitting gallery:', err);
      alert('Failed to submit image.');
    }
  };

  const resetForm = () => {
    setForm({ id: null, title: '', image: null });
    setPreview(null);
  };

  const handleEdit = (item) => {
    setForm({ id: item.id, title: item.title, image: null });
    setPreview(`${API_BASE}/api/gallery/image/${item.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this image?')) {
      try {
        await api.delete(`/api/gallery/${id}`);
        fetchGallery();
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete image.');
      }
    }
  };

  return (
    <div className="border p-6 bg-white rounded shadow mb-10">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Manage Gallery</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Image Title"
          required
          className="border px-4 py-2 rounded"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border px-4 py-2 rounded"
        />
        {preview && (
          <div className="col-span-1 md:col-span-2">
            <img src={preview} alt="Preview" className="h-32 rounded shadow" />
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
        >
          {form.id ? 'Update Image' : 'Add Image'}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="bg-gray-100 rounded shadow p-3 relative">
            <img
              src={`${API_BASE}/api/gallery/image/${item.id}`}
              alt={item.title}
              className="w-full h-40 object-cover rounded"
            />
            <div className="mt-2 text-sm font-medium">{item.title}</div>
            <div className="mt-1 flex justify-end gap-3 text-sm">
              <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryAdmin;
