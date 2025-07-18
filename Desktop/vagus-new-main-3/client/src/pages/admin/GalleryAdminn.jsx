import React, { useEffect, useState } from 'react';
import api from '../../api'; // Axios instance configured with base URL
import { toast } from 'react-toastify';

const GalleryAdminn = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [file, setFile] = useState(null);

  // Load categories with their images on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/image-gallery');
        setCategories(res.data);
        if (res.data.length > 0) {
          setSelectedCat(res.data[0].id.toString()); // set first category selected
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Find images for selected category
  const selectedCategory = categories.find(cat => cat.id.toString() === selectedCat);

  const handleUpload = async () => {
    if (!file) return toast.error('Please select an image file');
    if (!selectedCat) return toast.error('Please select a category');

    const formData = new FormData();
    formData.append('categoryId', selectedCat);
    formData.append('image', file);

    try {
      await api.post('/api/image-gallery/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Image uploaded successfully');
      setFile(null);

      // Refresh categories after upload to show new image
      const res = await api.get('/api/image-gallery');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Image upload failed');
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await api.delete(`/api/image-gallery/image/${imageId}`);
      toast.success('Image deleted');

      // Refresh categories after deletion
      const res = await api.get('/api/image-gallery');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gallery Admin Panel</h2>

      {/* Category Dropdown */}
      <div className="mb-4">
        <label htmlFor="category-select" className="block mb-1 font-medium">Select Category:</label>
        <select
          id="category-select"
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="" disabled>Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* File Input */}
      <div className="mb-4">
        <label htmlFor="image-upload" className="block mb-1 font-medium">Upload Image:</label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>

      {/* Images Grid */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {(selectedCategory?.images || []).map(img => (
          <div key={img.id} className="relative group border p-2 rounded shadow">
            <img
              src={img.image} // Assuming your backend sends image as base64 or URL
              alt={`Gallery ${img.id}`}
              className="w-full h-40 object-cover rounded"
            />
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryAdminn;
