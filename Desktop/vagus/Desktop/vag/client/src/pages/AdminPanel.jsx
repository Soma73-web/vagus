import React, { useState } from 'react';
import ResultAdmin from './admin/ResultAdmin';
import GalleryAdmin from './admin/GalleryAdmin';
import GalleryAdminn from './admin/GalleryAdminn';
import TestimonialAdmin from './admin/TestimonialAdmin';
import DownloadAdmin from './admin/DownloadAdmin';
import SliderAdmin from './admin/SliderAdmin';

const TABS = [
  { id: 'slider', label: 'Slider', component: <SliderAdmin /> },
  { id: 'results', label: 'Results', component: <ResultAdmin /> },
  { id: 'gallery', label: 'Gallery', component: <GalleryAdmin /> },
  { id: 'gallery-categorized', label: 'Gallery Categorized', component: <GalleryAdminn /> },
  { id: 'testimonials', label: 'Testimonials', component: <TestimonialAdmin /> },
  { id: 'downloads', label: 'Downloads', component: <DownloadAdmin /> },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('slider');

  const renderTabContent = () => {
    const tab = TABS.find((t) => t.id === activeTab);
    return tab?.component || null;
  };

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
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
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
          onClick={() => {
            localStorage.removeItem('admin_logged_in');
            window.location.href = '/admin-login';
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
