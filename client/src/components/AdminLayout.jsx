import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col p-6 border-r">
        <div className="text-2xl font-bold mb-8 text-blue-700">Admin Panel</div>
        <nav className="flex flex-col gap-4">
          {/* Example links, replace with actual navigation if needed */}
          <a href="#/admin" className="text-gray-700 hover:text-blue-600">Dashboard</a>
          <a href="#/admin?tab=students" className="text-gray-700 hover:text-blue-600">Students</a>
          <a href="#/admin?tab=attendance" className="text-gray-700 hover:text-blue-600">Attendance</a>
          <a href="#/admin?tab=events" className="text-gray-700 hover:text-blue-600">Events</a>
          <a href="#/admin?tab=gallery" className="text-gray-700 hover:text-blue-600">Gallery</a>
          <a href="#/admin?tab=downloads" className="text-gray-700 hover:text-blue-600">Downloads</a>
          <a href="#/admin?tab=results" className="text-gray-700 hover:text-blue-600">Results</a>
          <a href="#/admin?tab=testimonials" className="text-gray-700 hover:text-blue-600">Testimonials</a>
          <a href="#/admin?tab=popup" className="text-gray-700 hover:text-blue-600">Popup</a>
          <a href="#/admin?tab=study-materials" className="text-gray-700 hover:text-blue-600">Study Materials</a>
        </nav>
        <div className="mt-auto pt-8">
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              window.location.href = "#/admin-login";
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="mb-8 border-b pb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-800">Admin Dashboard</h1>
        </header>
        <section>{children}</section>
      </main>
    </div>
  );
};

export default AdminLayout; 