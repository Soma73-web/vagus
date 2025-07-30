import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDownloads = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/downloads`);
      setDownloads(res.data || []);
    } catch (err) {
      console.error("Downloads load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDownloads();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDownloads();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDownloads]);

  const handleDownload = async (downloadId, title) => {
    try {
      const response = await axios.get(`${API_BASE}/api/downloads/file/${downloadId}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', title || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <LoadingSpinner message="Loading downloadable resources..." />
        </div>
      </section>
    );
  }

  if (downloads.length === 0) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <EmptyState
            icon="📥"
            title="Downloads Coming Soon"
            message="Our downloadable resources are being prepared. Check back soon for amazing content!"
          />
        </div>
      </section>
    );
  }

  return (
    <section id="downloads" className="py-16 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-12 h-px bg-indigo-500"></div>
            <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
              Downloads
            </p>
            <div className="w-12 h-px bg-indigo-500"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Download{" "}
            <span className="text-indigo-600 underline">Resources</span> & Materials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloads.map((download) => (
            <div
              key={download.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <button
                  onClick={() => handleDownload(download.id, download.title)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Download
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {download.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {download.description || "Downloadable resource for NEET preparation"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Downloads; 