import React, { useEffect, useState } from 'react';
import api from '../../api'; // Axios instance with baseURL

const ResultAdmin = () => {
  const [results, setResults] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    rank: '',
    college: '',
    year: '',
    image: null,
  });
  const [preview, setPreview] = useState(null); // Thumbnail preview

  // ─────── Fetch results once ───────
  useEffect(() => {
    fetchResults();
  }, []);

  // ─────── Get all results ───────
  const fetchResults = async () => {
    try {
      const { data } = await api.get('/api/results');
      setResults(data || []);
    } catch (err) {
      console.error('Error fetching results:', err);
      alert('Failed to load results.');
    }
  };

  // ─────── Handle input changes ───────
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const file = files?.[0];
    setForm((prev) => ({ ...prev, [name]: file || value }));

    if (name === 'image' && file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ─────── Submit form ───────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('rank', form.rank);
    fd.append('college', form.college);
    fd.append('year', form.year);
    if (form.image) fd.append('image', form.image);

    try {
      if (form.id) {
        await api.put(`/api/results/${form.id}`, fd);
      } else {
        await api.post('/api/results', fd);
      }
      fetchResults();
      resetForm();
    } catch (err) {
      console.error('Error saving result:', err);
      alert('Failed to save result.');
    }
  };

  // ─────── Reset form ───────
  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      rank: '',
      college: '',
      year: '',
      image: null,
    });
    setPreview(null);
  };

  // ─────── Edit row ───────
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      rank: item.rank,
      college: item.college,
      year: item.year,
      image: null, // Must upload new image to change
    });
    setPreview(`/api/results/image/${item.id}`);
  };

  // ─────── Delete row ───────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result?')) return;
    try {
      await api.delete(`/api/results/${id}`);
      fetchResults();
    } catch (err) {
      console.error('Error deleting result:', err);
      alert('Failed to delete result.');
    }
  };

  // ─────── UI ───────
  return (
    <div className="border p-6 bg-white rounded shadow mb-10">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Manage Results</h2>

      {/* ─────── Form ─────── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {['name', 'rank', 'college', 'year'].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            required
            className="border px-4 py-2 rounded"
          />
        ))}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border px-4 py-2 rounded"
        />

        {preview && (
          <div className="md:col-span-2">
            <img src={preview} alt="Preview" className="h-24 rounded shadow mx-auto" />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
        >
          {form.id ? 'Update Result' : 'Add Result'}
        </button>
      </form>

      {/* ─────── Results List ─────── */}
      <ul className="space-y-3">
        {results.map((r) => (
          <li key={r.id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
            <div className="flex items-center gap-3">
              <img
                src={`/api/results/image/${r.id}`}
                alt={r.name}
                className="w-12 h-12 object-cover rounded-full border"
              />
              <div>
                <p className="font-medium">{r.name} — Rank {r.rank}</p>
                <p className="text-sm text-gray-600">{r.college} ({r.year})</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(r)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultAdmin;
