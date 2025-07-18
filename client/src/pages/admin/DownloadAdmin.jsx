import React, { useEffect, useState } from 'react';
import api from '../../api';

const DownloadAdmin = () => {
  const [downloads, setDownloads] = useState([]);
  const [form, setForm] = useState({ id: null, title: '', file: null });

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const res = await api.get('/api/downloads');
      setDownloads(res.data || []);
    } catch (error) {
      console.error('Failed to fetch downloads:', error);
      alert('Could not load downloads. Try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    if (form.file) formData.append('file', form.file);

    try {
      if (form.id) {
        await api.put(`/api/downloads/${form.id}`, formData);
      } else {
        await api.post('/api/downloads', formData);
      }
      resetForm();
      fetchDownloads();
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to save document. Try again.');
    }
  };

  const handleEdit = (item) => {
    setForm({ id: item.id, title: item.title, file: null });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await api.delete(`/api/downloads/${id}`);
      fetchDownloads();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete document.');
    }
  };

  const resetForm = () => {
    setForm({ id: null, title: '', file: null });
  };

  return (
    <div className="border p-6 bg-white rounded shadow mb-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Manage Downloads</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter document title"
          required
          className="border px-4 py-2 rounded"
        />
        <input
          type="file"
          name="file"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
        >
          {form.id ? 'Update Document' : 'Add Document'}
        </button>
      </form>

      <ul className="space-y-3">
        {downloads.map((doc) => (
          <li
            key={doc.id}
            className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded"
          >
            <span className="font-medium">{doc.title}</span>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(doc)} className="text-blue-600 hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DownloadAdmin;
