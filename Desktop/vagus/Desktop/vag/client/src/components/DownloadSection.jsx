import React, { useEffect, useState } from "react";
import api from "../api";
import { FaFileAlt, FaDownload, FaSpinner } from "react-icons/fa";
import Footer from "./Footer";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DownloadSection = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const res = await api.get("/api/downloads");
        setDownloads(res.data || []);
      } catch (err) {
        console.error("Error fetching downloads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  if (!API_BASE_URL) {
    return (
      <div className="text-center text-red-600 py-10">
        ⚠️ <code>REACT_APP_API_BASE_URL</code> not configured.
      </div>
    );
  }

  return (
    <>
      <div className="pt-[96px] bg-gradient-to-b from-gray-50 to-white">
        {/* Page Header - Just below nav bar */}
        <h1 className="text-3xl font-bold text-center mb-10 text-indigo-800 pt-6">
          Downloads
        </h1>

        <section className="pb-16 bg-gradient-to-br from-blue-50 to-white min-h-screen">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-center mb-8 text-blue-800">
                Study Materials & Resources
              </h2>

              {loading ? (
                <div className="text-center py-8 text-blue-600 flex justify-center items-center gap-2">
                  <FaSpinner className="animate-spin text-2xl" />
                  <span className="text-lg font-medium">Loading files…</span>
                </div>
              ) : downloads.length === 0 ? (
                <p className="text-center text-gray-500">
                  No files uploaded yet.
                </p>
              ) : (
                <ul className="space-y-4">
                  {downloads.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 border rounded shadow p-4"
                    >
                      <div className="flex items-center gap-3">
                        <FaFileAlt className="text-indigo-500 text-xl" />
                        <span className="text-gray-800 font-medium">
                          {doc.title}
                        </span>
                      </div>

                      <a
                        href={`${API_BASE_URL}/api/downloads/file/${doc.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 sm:mt-0 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-sm"
                      >
                        <FaDownload />
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default DownloadSection;
