import React, { useState, useEffect } from "react";
import axios from "axios";
import { showSuccess, showError } from "../../utils/notifications";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const PopupAdmin = () => {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPopup, setEditingPopup] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    announcementType: "general",
    startDate: "",
    endDate: "",
    isEnabled: false,
    showOnHomepage: true,
  });

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/popup-announcements`, {
        headers: { "Admin-Auth": "admin-authenticated" },
      });
      setPopups(response.data);
    } catch (error) {
      console.error("Failed to fetch popups:", error);
      showError("Failed to load popup announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      announcementType: "general",
      startDate: "",
      endDate: "",
      isEnabled: false,
      showOnHomepage: true,
    });
    setEditingPopup(null);
    setShowCreateForm(false);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      showError("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      showError("Description is required");
      return false;
    }
    if (!formData.imageUrl.trim()) {
      showError("Image URL is required");
      return false;
    }
    if (!formData.imageUrl.includes("cloudinary.com")) {
      showError("Please use a valid Cloudinary image URL");
      return false;
    }
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        showError("End date must be after start date");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const cleanedData = { ...formData };

      // Clean up empty date fields
      if (!cleanedData.startDate) cleanedData.startDate = null;
      if (!cleanedData.endDate) cleanedData.endDate = null;

      if (editingPopup) {
        await axios.put(
          `${API_BASE}/api/popup-announcements/${editingPopup.id}`,
          cleanedData,
          { headers: { "Admin-Auth": "admin-authenticated" } },
        );
        showSuccess("Popup announcement updated successfully");
      } else {
        await axios.post(`${API_BASE}/api/popup-announcements`, cleanedData, {
          headers: { "Admin-Auth": "admin-authenticated" },
        });
        showSuccess("Popup announcement created successfully");
      }

      resetForm();
      await fetchPopups();
    } catch (error) {
      console.error("Popup operation failed:", error);
      const errorMessage = error.response?.data?.error || "Operation failed";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (popup) => {
    setFormData({
      title: popup.title,
      description: popup.description,
      imageUrl: popup.imageUrl,
      announcementType: popup.announcementType,
      startDate: popup.startDate ? popup.startDate.split("T")[0] : "",
      endDate: popup.endDate ? popup.endDate.split("T")[0] : "",
      isEnabled: popup.isEnabled,
      showOnHomepage: popup.showOnHomepage,
    });
    setEditingPopup(popup);
    setShowCreateForm(true);
  };

  const handleToggleStatus = async (popupId) => {
    try {
      await axios.patch(
        `${API_BASE}/api/popup-announcements/${popupId}/toggle`,
        {},
        { headers: { "Admin-Auth": "admin-authenticated" } },
      );
      showSuccess("Popup status updated successfully");
      await fetchPopups();
    } catch (error) {
      console.error("Failed to toggle popup status:", error);
      showError("Failed to update popup status");
    }
  };

  const handleDelete = async (popupId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this popup announcement?",
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/api/popup-announcements/${popupId}`, {
        headers: { "Admin-Auth": "admin-authenticated" },
      });
      showSuccess("Popup announcement deleted successfully");
      await fetchPopups();
    } catch (error) {
      console.error("Failed to delete popup:", error);
      showError("Failed to delete popup announcement");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Popup Announcements
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Add New Popup
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingPopup
              ? "Edit Popup Announcement"
              : "Create New Popup Announcement"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter announcement description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cloudinary Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://res.cloudinary.com/..."
                required
              />
              <small className="text-gray-500">
                Upload your image to Cloudinary and paste the URL here
              </small>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Announcement Type
                </label>
                <select
                  name="announcementType"
                  value={formData.announcementType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="admission">Admission</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isEnabled"
                    checked={formData.isEnabled}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Enable Popup
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="showOnHomepage"
                    checked={formData.showOnHomepage}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Show on Homepage
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date (Optional)
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingPopup
                    ? "Update Popup"
                    : "Create Popup"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Popups List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Existing Popup Announcements</h3>
        </div>

        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : popups.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No popup announcements found. Create your first popup above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {popups.map((popup) => (
                  <tr key={popup.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={popup.imageUrl}
                          alt={popup.title}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {popup.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {popup.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          popup.announcementType === "admission"
                            ? "bg-green-100 text-green-800"
                            : popup.announcementType === "achievement"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {popup.announcementType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          popup.isEnabled
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {popup.isEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {popup.startDate
                        ? new Date(popup.startDate).toLocaleDateString()
                        : "No start"}{" "}
                      -
                      {popup.endDate
                        ? new Date(popup.endDate).toLocaleDateString()
                        : "No end"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(popup)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(popup.id)}
                        className={
                          popup.isEnabled
                            ? "text-red-600 hover:text-red-900"
                            : "text-green-600 hover:text-green-900"
                        }
                      >
                        {popup.isEnabled ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => handleDelete(popup.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupAdmin;
