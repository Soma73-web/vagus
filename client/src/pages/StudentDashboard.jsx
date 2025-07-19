import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AttendanceCalendar from "../components/AttendanceCalendar";
import TestResults from "../components/TestResults";
import StudyMaterials from "../components/StudyMaterials";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("attendance");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    const studentInfo = localStorage.getItem("studentInfo");

    if (!token || !studentInfo) {
      toast.error("Please login to access your dashboard");
      navigate("/student-login");
      return;
    }

    try {
      setStudent(JSON.parse(studentInfo));
    } catch (error) {
      console.error("Error parsing student info:", error);
      navigate("/student-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentInfo");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Student Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {student.firstName} {student.lastName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
              <p className="text-lg font-semibold text-gray-900">
                {student.studentId}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Course</h3>
              <p className="text-lg font-semibold text-gray-900">
                {student.course}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Batch</h3>
              <p className="text-lg font-semibold text-gray-900">
                {student.batch}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("attendance")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "attendance"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Attendance
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "results"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Test Results
              </button>
              <button
                onClick={() => setActiveTab("study-materials")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "study-materials"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Study Materials
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "attendance" && (
              <AttendanceCalendar studentId={student.id} />
            )}
            {activeTab === "results" && <TestResults studentId={student.id} />}
            {activeTab === "study-materials" && <StudyMaterials />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
