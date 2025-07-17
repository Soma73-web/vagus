import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { sanitizeInput, validateEmail, debounce } from "../../utils/security";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const StudentAdmin = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    course: "",
    batch: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/admin/students`, {
        headers: { "Admin-Auth": "admin-authenticated" },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Sanitize input to prevent XSS
    const sanitizedValue =
      typeof value === "string" ? sanitizeInput(value) : value;

    setFormData({
      ...formData,
      [name]: sanitizedValue,
    });
  };

  const validateForm = () => {
    const errors = [];

    // Required fields validation
    if (!formData.studentId.trim()) errors.push("Student ID is required");
    if (!formData.firstName.trim()) errors.push("First name is required");
    if (!formData.lastName.trim()) errors.push("Last name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.course.trim()) errors.push("Course is required");
    if (!formData.batch.trim()) errors.push("Batch is required");

    // Password validation for new students
    if (!editingStudent && !formData.password.trim()) {
      errors.push("Password is required");
    }
    if (formData.password && formData.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    // Email format validation
    if (formData.email && !validateEmail(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    // Student ID format validation
    if (formData.studentId && !/^[a-zA-Z0-9]+$/.test(formData.studentId)) {
      errors.push("Student ID must contain only alphanumeric characters");
    }

    // Name validation
    if (formData.firstName && !/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      errors.push("First name must contain only letters and spaces");
    }
    if (formData.lastName && !/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      errors.push("Last name must contain only letters and spaces");
    }

    // Phone validation
    if (formData.phone && !/^[+]?[\d\s\-\(\)]{10,15}$/.test(formData.phone)) {
      errors.push("Please enter a valid phone number");
    }

    // Date validation
    if (formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
      errors.push("Date of birth cannot be in the future");
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      dateOfBirth: "",
      course: "",
      batch: "",
    });
    setEditingStudent(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare clean data (remove empty strings for optional fields)
      const cleanedData = { ...formData };
      Object.keys(cleanedData).forEach((key) => {
        if (cleanedData[key] === "") {
          cleanedData[key] = null;
        }
      });

      // Remove password from update data if it's empty
      if (editingStudent && !cleanedData.password) {
        delete cleanedData.password;
      }

      let response;
      if (editingStudent) {
        // Update existing student
        response = await axios.put(
          `${API_BASE}/api/admin/students/${editingStudent.id}`,
          cleanedData,
          {
            headers: { "Admin-Auth": "admin-authenticated" },
            timeout: 10000, // 10 second timeout
          },
        );
        toast.success("Student updated successfully");
      } else {
        // Create new student
        response = await axios.post(
          `${API_BASE}/api/admin/students`,
          cleanedData,
          {
            headers: { "Admin-Auth": "admin-authenticated" },
            timeout: 10000, // 10 second timeout
          },
        );
        toast.success("Student created successfully");
      }

      // Reset form and refresh data immediately
      resetForm();
      await fetchStudents();
    } catch (error) {
      console.error("Student operation failed:", error);

      // Handle different types of errors
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.details && Array.isArray(errorData.details)) {
          errorData.details.forEach((detail) => toast.error(detail));
        } else {
          toast.error(errorData.error || "Invalid input data");
        }
      } else if (error.response?.status === 401) {
        toast.error("Authentication required. Please refresh and try again.");
      } else if (error.response?.status === 409) {
        toast.error("Student ID or email already exists");
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please try again.");
      } else {
        const errorMessage = error.response?.data?.error || "Operation failed";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      password: "", // Don't pre-fill password
      phone: student.phone || "",
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split("T")[0] : "",
      course: student.course,
      batch: student.batch,
    });
    setEditingStudent(student);
    setShowCreateForm(true);
  };

  const handleDeactivate = async (studentId) => {
    if (
      !window.confirm(
        "Are you sure you want to deactivate this student? They will not be able to login.",
      )
    ) {
      return;
    }

    try {
      await axios.put(
        `${API_BASE}/api/admin/students/${studentId}`,
        { isActive: false },
        { headers: { "Admin-Auth": "admin-authenticated" } },
      );
      toast.success("Student deactivated successfully");
      await fetchStudents();
    } catch (error) {
      console.error("Failed to deactivate student:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to deactivate student";
      toast.error(errorMessage);
    }
  };

  const handlePermanentDelete = async (studentId, studentName) => {
    const confirmMessage = `Are you sure you want to PERMANENTLY DELETE ${studentName}? This action cannot be undone and will remove all attendance records and test results.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    // Double confirmation for permanent deletion
    if (
      !window.confirm(
        "This is permanent deletion. Type 'DELETE' to confirm:",
      ) ||
      !window.prompt("Type DELETE to confirm:") === "DELETE"
    ) {
      toast.info("Deletion cancelled");
      return;
    }

    try {
      await axios.delete(`${API_BASE}/api/admin/students/${studentId}`, {
        headers: { "Admin-Auth": "admin-authenticated" },
      });
      toast.success("Student permanently deleted");
      await fetchStudents();
    } catch (error) {
      console.error("Failed to delete student:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to delete student";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Add New Student
        </button>
      </div>

      {/* Create/Edit Student Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingStudent ? "Edit Student" : "Create New Student"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password{" "}
                    {editingStudent ? "(leave empty to keep current)" : "*"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingStudent}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., NEET Preparation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch *
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 2024-25"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {loading
                    ? "Saving..."
                    : editingStudent
                      ? "Update Student"
                      : "Create Student"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students List */}
      {loading && !showCreateForm ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading students...</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course & Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {student.studentId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.phone || "No phone"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.course}
                      </div>
                      <div className="text-sm text-gray-500">
                        Batch: {student.batch}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      {student.isActive && (
                        <button
                          onClick={() => handleDeactivate(student.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAdmin;
