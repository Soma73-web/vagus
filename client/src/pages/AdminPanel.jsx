import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authManager from "../utils/auth";
import ResultAdmin from "./admin/ResultAdmin";
import GalleryAdmin from "./admin/GalleryAdmin";
import GalleryAdminn from "./admin/GalleryAdminn";
import TestimonialAdmin from "./admin/TestimonialAdmin";
import DownloadAdmin from "./admin/DownloadAdmin";
import SliderAdmin from "./admin/SliderAdmin";
import StudentAdmin from "./admin/StudentAdmin";
import AttendanceAdmin from "./admin/AttendanceAdmin";
import TestResultAdmin from "./admin/TestResultAdmin";
import EventAdmin from "./admin/EventAdmin";
import StudyMaterialAdmin from "./admin/StudyMaterialAdmin";

const TABS = [
  { id: "slider", label: "Slider", component: <SliderAdmin /> },
  { id: "students", label: "Students", component: <StudentAdmin /> },
  { id: "attendance", label: "Attendance", component: <AttendanceAdmin /> },
  { id: "test-results", label: "Test Results", component: <TestResultAdmin /> },
  { id: "events", label: "Events", component: <EventAdmin /> },
  {
    id: "study-materials",
    label: "Study Materials",
    component: <StudyMaterialAdmin />,
  },
  { id: "results", label: "Results", component: <ResultAdmin /> },
  { id: "gallery", label: "Gallery", component: <GalleryAdmin /> },
  {
    id: "gallery-categorized",
    label: "Gallery Categorized",
    component: <GalleryAdminn />,
  },
  {
    id: "testimonials",
    label: "Testimonials",
    component: <TestimonialAdmin />,
  },
  { id: "downloads", label: "Downloads", component: <DownloadAdmin /> },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("slider");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await authManager.verifyToken();
      if (!isAuthenticated) {
        navigate("/admin-login");
      } else {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  const renderTabContent = () => {
    const tab = TABS.find((t) => t.id === activeTab);
    return tab?.component || null;
  };

  const handleLogout = () => {
    authManager.removeToken();
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Verifying authentication...</div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 sm:px-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex flex-wrap mb-6 gap-2 justify-center">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mb-12">{renderTabContent()}</div>

      {/* Logout Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
