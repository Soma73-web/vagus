import React, { useEffect, useState } from "react";
import api from "../../api";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const FacultyAdmin = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ id: null, name: "", subject: "", photo: null });
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchFaculty = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/faculty");
      setFaculty(res.data || []);
    } catch (err) {
      setError("Failed to load faculty");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setForm((prev) => ({ ...prev, photo: files[0] }));
      setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (fac) => {
    setForm({ id: fac.id, name: fac.name, subject: fac.subject, photo: null });
    setPreview(fac.photo ? fac.photo : null);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this faculty member?")) return;
    try {
      await api.delete(`/api/faculty/${id}`);
      fetchFaculty();
    } catch {
      alert("Failed to delete faculty");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("subject", form.subject);
      if (form.photo) formData.append("photo", form.photo);
      if (editing && form.id) {
        await api.put(`/api/faculty/${form.id}`, formData);
      } else {
        await api.post("/api/faculty", formData);
      }
      setForm({ id: null, name: "", subject: "", photo: null });
      setPreview(null);
      setEditing(false);
      fetchFaculty();
    } catch {
      alert("Failed to save faculty");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm({ id: null, name: "", subject: "", photo: null });
    setPreview(null);
    setEditing(false);
  };

  const getPhotoUrl = (photo, name) => {
    if (!photo) return null;
    if (photo.startsWith('/uploads')) return `${API_BASE}${photo}`;
    return photo;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Faculty Management</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleInputChange}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g. Biology, Chemistry"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full"
            />
            {preview && (
              <img src={preview} alt="Preview" className="h-16 w-16 rounded-full mt-2 object-cover border" />
            )}
          </div>
        </div>
        <div className="flex gap-4 mt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
          >
            {editing ? (submitting ? "Updating..." : "Update Faculty") : (submitting ? "Adding..." : "Add Faculty")}
          </button>
          {editing && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Faculty List</h3>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : faculty.length === 0 ? (
          <div>No faculty found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Photo</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((fac) => (
                <tr key={fac.id} className="border-t">
                  <td className="px-4 py-2">
                    {fac.photo ? (
                      <img src={getPhotoUrl(fac.photo, fac.name)} alt={fac.name} className="h-32 w-32 rounded-full object-cover border" onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fac.name); }} />
                    ) : (
                      <span className="text-gray-400">No photo</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{fac.name}</td>
                  <td className="px-4 py-2">{fac.subject}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(fac)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(fac.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FacultyAdmin; 