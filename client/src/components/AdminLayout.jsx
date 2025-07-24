import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authManager from "../utils/auth";
import BuildInfo from "./BuildInfo";
import { FaTachometerAlt, FaUserGraduate, FaChalkboardTeacher, FaImages, FaRegListAlt, FaBook, FaFileAlt, FaSignOutAlt, FaMedal, FaChartBar, FaLayerGroup, FaUsers, FaRegCommentDots, FaThLarge } from "react-icons/fa";

const ICONS = {
  analytics: <FaChartBar className="inline mr-2" />, // Not in default navItems, but in TABS
  faculty: <FaChalkboardTeacher className="inline mr-2" />,
  achievements: <FaMedal className="inline mr-2" />,
  slider: <FaThLarge className="inline mr-2" />,
  students: <FaUserGraduate className="inline mr-2" />,
  attendance: <FaUsers className="inline mr-2" />,
  "test-results": <FaRegListAlt className="inline mr-2" />,
  "study-materials": <FaBook className="inline mr-2" />,
  popup: <FaRegCommentDots className="inline mr-2" />,
  results: <FaTachometerAlt className="inline mr-2" />,
  gallery: <FaImages className="inline mr-2" />,
  "gallery-categorized": <FaLayerGroup className="inline mr-2" />,
  testimonials: <FaRegCommentDots className="inline mr-2" />,
  downloads: <FaFileAlt className="inline mr-2" />,
  leads: <FaUserGraduate className="inline mr-2" />,
};

const AdminLayout = ({ children, activeTab, setActiveTab, navigationItems }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Sidebar overlay for mobile
  const Sidebar = (
    <aside className={`bg-white shadow-xl flex flex-col justify-between h-full p-4 sm:p-6 border-r z-40 w-72 max-w-full fixed sm:static left-0 top-0 bottom-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'} sm:translate-x-0 sm:w-64 sm:max-w-xs sm:sticky sm:top-0`}>
      <div>
        <div className="text-2xl font-bold mb-8 text-blue-700 text-center select-none">Admin Panel</div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:z-10 ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
              tabIndex={0}
              aria-current={activeTab === item.id ? "page" : undefined}
            >
              {ICONS[item.id] || <span className="w-5 inline-block" />} {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-2 pt-4 pb-2 mt-8 sm:mt-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <FaSignOutAlt /> Logout
        </button>
        <BuildInfo />
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar for desktop & overlay for mobile */}
      <div className="sm:block">
        {/* Hamburger for mobile */}
        <button
          className="sm:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Open sidebar"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        {/* Sidebar overlay for mobile */}
        <div className={`fixed inset-0 bg-black bg-opacity-30 z-30 transition-opacity duration-300 ${sidebarOpen ? 'block' : 'hidden'} sm:hidden`} onClick={() => setSidebarOpen(false)} />
        {Sidebar}
      </div>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-2 sm:px-8 py-6 sm:py-10 ml-0 sm:ml-64 transition-all duration-300 max-w-7xl mx-auto w-full">
        <header className="mb-6 sm:mb-8 border-b pb-3 sm:pb-4 flex flex-col sm:flex-row items-center justify-between w-full bg-white/80 sticky top-0 z-20 shadow-sm rounded-b-lg">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 w-full sm:w-auto text-center sm:text-left">
            {navItems.find(item => item.id === activeTab)?.label || "Admin Dashboard"}
          </h1>
        </header>
        <section className="w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 sm:p-10 mb-8 min-h-[60vh]">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout; 