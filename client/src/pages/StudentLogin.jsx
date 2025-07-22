import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE}/api/students/login`,
        formData,
      );

      // Store token and student info in localStorage
      localStorage.setItem("studentToken", response.data.token);
      localStorage.setItem(
        "studentInfo",
        JSON.stringify(response.data.student),
      );

      toast.success("Login successful!");
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Student Login
          </h2>
          <p className="text-gray-600">
            Access your dashboard and view your progress
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="studentId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your student ID"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Having trouble logging in?{" "}
            <a
              href="/contact"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
