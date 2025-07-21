import React from "react";
import { useNavigate } from "react-router-dom";
import authManager from "../utils/auth";
import BuildInfo from "./BuildInfo";

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const navigation = useNavigate();
  const navigationItems = [
    { id: "slider", label: "Slider" },
    { id: "students", label: "Students" },
    { id: "attendance", label: "Attendance" },
    { id: "test-results", label: "Test Results" },
    { id: "events", label: "Events" },
    { id: "study-materials", label: "Study Materials" },
    { id: "popup", label: "Popup" },
    { id: "results", label: "Results" },
    { id: "gallery", label: "Gallery" },
    { id: "gallery-categorized", label: "Gallery Categorized" },
    { id: "testimonials", label: "Testimonials" },
    { id: "downloads", label: "Downloads" },
  ];

  const handleLogout = () => {
    authManager.removeToken();
    window.location.href = "#/admin-login";
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col p-6 border-r">
        <div className="text-2xl font-bold mb-8 text-blue-700">Admin Panel</div>
        <nav className="flex flex-col gap-2 flex-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors"
          >
            Logout
          </button>
          <BuildInfo />
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="mb-8 border-b pb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-800">
            {navigationItems.find(item => item.id === activeTab)?.label || "Admin Dashboard"}
          </h1>
        </header>
        <section>{children}</section>
      </main>
    </div>
  );
};

export default AdminLayout; 