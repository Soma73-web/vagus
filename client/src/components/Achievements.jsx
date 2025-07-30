import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/achievements`);
      setAchievements(res.data || []);
    } catch (err) {
      console.error("Achievements load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAchievements();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAchievements]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <LoadingSpinner message="Loading our achievements..." />
        </div>
      </section>
    );
  }

  if (achievements.length === 0) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <EmptyState
            icon="🏆"
            title="Achievements Coming Soon"
            message="Our achievements and awards are being prepared. Check back soon for amazing accomplishments!"
          />
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="py-16 bg-gray-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-12 h-px bg-indigo-500"></div>
            <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
              Achievements
            </p>
            <div className="w-12 h-px bg-indigo-500"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Our{" "}
            <span className="text-indigo-600 underline">Proud</span> Achievements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="relative">
                <img
                  src={`${API_BASE}/api/achievements/${achievement.id}/image`}
                  alt={achievement.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/fallback-achievement.jpg";
                  }}
                />
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  🏆
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {achievement.description}
                </p>
                {achievement.year && (
                  <div className="text-indigo-600 font-medium text-sm">
                    {achievement.year}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements; 