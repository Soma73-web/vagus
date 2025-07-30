import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFaculty = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/faculty`);
      setFaculty(res.data || []);
    } catch (err) {
      console.error("Faculty load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaculty();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchFaculty();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchFaculty]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <LoadingSpinner message="Loading our expert faculty..." />
        </div>
      </section>
    );
  }

  if (faculty.length === 0) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <EmptyState
            icon="👨‍🏫"
            title="Faculty Profiles Coming Soon"
            message="Our expert faculty profiles are being prepared. Check back soon to meet our amazing teachers!"
          />
        </div>
      </section>
    );
  }

  return (
    <section id="faculty" className="py-16 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-12 h-px bg-indigo-500"></div>
            <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
              Faculty
            </p>
            <div className="w-12 h-px bg-indigo-500"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Meet Our{" "}
            <span className="text-indigo-600 underline">Expert</span> Faculty
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {faculty.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="relative">
                <img
                  src={`${API_BASE}/api/faculty/${member.id}/photo`}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/fallback-faculty.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-indigo-600 font-medium mb-3">
                  {member.designation || "Faculty Member"}
                </p>
                {member.education && (
                  <p className="text-gray-600 text-sm mb-3">
                    {member.education}
                  </p>
                )}
                {member.experience && (
                  <p className="text-gray-600 text-sm">
                    Experience: {member.experience}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faculty; 