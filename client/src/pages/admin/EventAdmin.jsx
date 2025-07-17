import React, { useState, useEffect } from "react";
import api from "../../api";
import { showSuccess, showError, showWarning } from "../../utils/notifications";

const EventAdmin = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    category: "general",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/api/events");
      setEvents(response.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Input sanitization
    const sanitizedValue =
      typeof value === "string" ? value.replace(/[<>"']/g, "") : value;

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      showError("Description is required");
      return false;
    }
    if (formData.description.length > 500) {
      showError("Description must be less than 500 characters");
      return false;
    }
    if (formData.title && formData.title.length > 100) {
      showError("Title must be less than 100 characters");
      return false;
    }
    if (
      formData.eventDate &&
      new Date(formData.eventDate) < new Date().setHours(0, 0, 0, 0)
    ) {
      showWarning("Event date is in the past");
    }
    return true;
  };

  const validateFile = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      showError(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
      );
      return false;
    }

    if (file.size > maxSize) {
      showError("File size too large. Maximum size is 5MB.");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && !validateFile(file)) {
      e.target.value = ""; // Clear the input
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("description", formData.description.trim());

      if (formData.title.trim()) {
        form.append("title", formData.title.trim());
      }

      if (formData.eventDate) {
        form.append("eventDate", formData.eventDate);
      }

      if (formData.category) {
        form.append("category", formData.category);
      }

      if (formData.image) {
        form.append("image", formData.image);
      }

      let response;
      if (editingId) {
        response = await api.put(`/api/events/${editingId}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Admin-Auth": "admin-authenticated",
          },
        });
        showSuccess("Event updated successfully!");
      } else {
        await api.post("/api/events", form, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Admin-Auth": "admin-authenticated",
          },
        });
        showSuccess("Event created successfully!");
      }

      // Reset form and fetch updated events immediately
      resetForm();
      await fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to save event";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title || "",
      description: event.description || "",
      eventDate: event.eventDate
        ? new Date(event.eventDate).toISOString().split("T")[0]
        : "",
      category: event.category || "general",
      image: null,
    });
    setEditingId(event.id);
    setPreview(
      event.imageUrl
        ? `${api.defaults.baseURL}/api/events/image/${event.id}`
        : null,
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/api/events/${id}`, {
        headers: {
          "Admin-Auth": "admin-authenticated",
        },
      });
      await fetchEvents();
      showSuccess("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to delete event";
      showError(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      eventDate: "",
      category: "general",
      image: null,
    });
    setEditingId(null);
    setPreview(null);

    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-6 text-blue-800">
        Manage Events
      </h3>

      {/* Event Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Event Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={!editingId}
          />
        </div>

        {preview && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Preview</label>
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded-md border"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Event Title (Optional)
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter event title..."
            maxLength="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Enter event description..."
            maxLength="500"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <small className="text-gray-500">
            {formData.description.length}/500 characters
          </small>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Date (Optional)
            </label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">General</option>
              <option value="academic">Academic</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : editingId ? "Update Event" : "Add Event"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Events List */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Existing Events</h4>

        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No events found. Add your first event above.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
              >
                {event.imageUrl && (
                  <img
                    src={`${api.defaults.baseURL}/api/events/image/${event.id}`}
                    alt="Event"
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4">
                  {event.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {event.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
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
    </div>
  );
};

export default EventAdmin;
