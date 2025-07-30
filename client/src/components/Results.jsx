import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/results`);
      setResults(res.data || []);
    } catch (err) {
      console.error("Results load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchResults();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchResults]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <LoadingSpinner message="Loading our success stories..." />
        </div>
      </section>
    );
  }

  if (results.length === 0) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <EmptyState
            icon="🏆"
            title="Results Coming Soon"
            message="Our students are working hard to achieve great results. Check back soon for amazing achievements!"
          />
        </div>
      </section>
    );
  }

  return (
    <section id="results" className="py-16 bg-gray-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-12 h-px bg-indigo-500"></div>
            <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
              Results
            </p>
            <div className="w-12 h-px bg-indigo-500"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Our{" "}
            <span className="text-indigo-600 underline">Success</span> Stories
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {result.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {result.description}
                </p>
                <div className="text-2xl font-bold text-indigo-600">
                  {result.score}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;
