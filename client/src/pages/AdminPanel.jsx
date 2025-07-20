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
import PopupAdmin from "./admin/PopupAdmin";
import AdminLayout from "../components/AdminLayout";

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
  { id: "popup", label: "Popup", component: <PopupAdmin /> },
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Verifying authentication...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      {/* Tab selection logic can be improved to use query params or context for sidebar links */}
      {renderTabContent()}
    </AdminLayout>
  );
};

export default AdminPanel;
