import React, { useEffect, useState } from 'react';
import api from '../../api'; // Axios instance

const SliderAdmin = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch all slider images
  const fetchImages = async () => {
    try {
      const { data } = await api.get('/api/slider');
      setImages(data || []);
    } catch (err) {
      console.error('Failed to fetch images:', err);
      alert('Failed to load slider images.');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // Upload selected file
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert('Please select an image first.');

    try {
      const fd = new FormData();
      fd.append('photo', selectedFile);

      await api.post('/api/slider', fd);
      setSelectedFile(null);
      setPreview(null);
      fetchImages();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image.');
    }
  };

  // Delete image by ID
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;

    try {
      await api.delete(`/api/slider/${id}`);
      fetchImages();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete image.');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-blue-800">Manage Slider Images</h3>

      <form onSubmit={handleUpload} className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full sm:w-auto border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </form>

      {preview && (
        <div className="mb-4">
          <img src={preview} alt="Preview" className="h-24 rounded shadow mx-auto" />
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative">
            <img
              src={`${api.defaults.baseURL}/api/slider/image/${img.id}`} // ✅ full image URL
              alt="Slider"
              className="w-full h-32 object-cover rounded shadow"
            />
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderAdmin;
