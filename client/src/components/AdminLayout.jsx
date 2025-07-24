import React from "react";
import { useNavigate } from "react-router-dom";
import authManager from "../utils/auth";
import BuildInfo from "./BuildInfo";

const AdminLayout = ({ children, activeTab, setActiveTab, navigationItems }) => {
  const defaultNavigationItems = [
    { id: "slider", label: "Slider" },
    { id: "students", label: "Students" },
    { id: "attendance", label: "Attendance" },
    { id: "test-results", label: "Test Results" },
    { id: "study-materials", label: "Study Materials" },
    { id: "popup", label: "Popup" },
    { id: "results", label: "Results" },
    { id: "gallery", label: "Gallery" },
    { id: "gallery-categorized", label: "Gallery Categorized" },
    { id: "testimonials", label: "Testimonials" },
    { id: "downloads", label: "Downloads" },
  ];
  const navItems = navigationItems || defaultNavigationItems;

  const navigate = useNavigate();
  const handleLogout = () => {
    authManager.removeToken();
    navigate('/admin-login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full sm:w-64 bg-white shadow-lg flex flex-col justify-between min-h-screen p-4 sm:p-6 border-r fixed sm:static left-0 top-0 bottom-0 z-30 max-h-screen overflow-y-auto sm:sticky sm:top-0">
        <div>
          <div className="text-2xl font-bold mb-8 text-blue-700">Admin Panel</div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
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
        </div>
        <div className="flex flex-col gap-2 pt-4 pb-2 mt-8 sm:mt-0">
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
      <main className="flex-1 flex flex-col items-center px-2 sm:px-8 py-4 sm:py-10 ml-0 sm:ml-64 transition-all duration-300 max-w-6xl mx-auto w-full">
        <header className="mb-6 sm:mb-8 border-b pb-3 sm:pb-4 flex flex-col sm:flex-row items-center justify-between w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 w-full sm:w-auto text-center sm:text-left">
            {navItems.find(item => item.id === activeTab)?.label || "Admin Dashboard"}
          </h1>
        </header>
        <section className="w-full flex flex-col items-center justify-center">{children}</section>
      </main>
    </div>
  );
};

export default AdminLayout; 