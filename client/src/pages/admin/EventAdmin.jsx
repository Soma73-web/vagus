import React, { useState, useEffect } from "react";
import api from "../../api";

const EventAdmin = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
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
    setLoading(true);

    try {
      const form = new FormData();
      form.append("description", formData.description);

      if (formData.image) {
        form.append("image", formData.image);
      }

      if (editingId) {
        await api.put(`/api/events/${editingId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/api/events", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Reset form and fetch updated events
      resetForm();
      await fetchEvents();
      alert("Event saved successfully!");
    } catch (error) {
      console.error("Error saving event:", error);
      alert(
        "Failed to save event: " +
          (error.response?.data?.error || error.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      description: event.description || "",
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
      await api.delete(`/api/events/${id}`);
      await fetchEvents();
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    }
  };

  const resetForm = () => {
    setFormData({
      description: "",
      image: null,
    });
    setEditingId(null);
    setPreview(null);

    // Reset form inputs
    const form = document.querySelector("form");
    if (form) form.reset();
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
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Enter event description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
