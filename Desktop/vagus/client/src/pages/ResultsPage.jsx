import React, { useEffect, useState } from "react";
import api from "../api";
import Contact from "./ContactPage";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

const ResultPage = () => {
  const [items, setItems] = useState([]);
  const [years, setYears] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get("/api/results");
        const data = res.data.map((r) => ({
          ...r,
          photoUrl: `${API_BASE}/api/results/${r.id}/image`,
        }));
        setItems(data);

        const ys = [...new Set(data.map((r) => r.year))].sort((a, b) => b - a);
        setYears(ys);
        setSelected(ys[0] ?? null);
      } catch (err) {
        console.error("Failed to load results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const filtered = selected
    ? items.filter((i) => String(i.year) === String(selected))
    : [];

  return (
    <div className="pt-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold tracking-wide mb-4">
            Our Achievers
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            Celebrating the success stories of our students who have excelled in
            NEET examinations
          </p>
          <div className="w-24 h-1 bg-white mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 transform translate-x-16 -translate-y-8">
          <div className="w-96 h-96 bg-white opacity-5 rounded-full"></div>
        </div>
        <div className="absolute bottom-0 left-0 transform -translate-x-16 translate-y-8">
          <div className="w-64 h-64 bg-white opacity-5 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Year Filter */}
        {years.length > 0 && (
          <div className="flex justify-center flex-wrap mb-16 gap-3">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelected(year)}
                className={`px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                  String(selected) === String(year)
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 shadow-md"
                }`}
              >
                NEET {year}
              </button>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-lg">
              Loading our achievers...
            </p>
          </div>
        ) : !filtered.length ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🏆</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Results Coming Soon
            </h3>
            <p className="text-gray-600 text-lg">
              Results for{" "}
              <span className="font-semibold text-blue-600">
                NEET {selected}
              </span>{" "}
              will be updated soon
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                NEET {selected} Toppers
              </h2>
              <p className="text-gray-600">
                <span className="font-semibold text-blue-600">
                  {filtered.length}
                </span>{" "}
                students achieved excellence
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  {/* Student Image */}
                  <div className="relative p-6 pb-4">
                    <div className="relative mx-auto w-28 h-28 mb-4">
                      <img
                        src={r.photoUrl}
                        alt={r.name}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-full border-4 border-yellow-400 shadow-lg"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/fallback.png";
                        }}
                      />
                    </div>

                    {/* Student Info */}
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                        {r.name}
                      </h4>

                      {/* Rank Badge */}
                      <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-full text-sm font-semibold mb-3 shadow-md">
                        AIR: {r.rank}
                      </div>

                      {/* College Info */}
                      {r.college && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">
                            Admitted to
                          </p>
                          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium px-3 py-2 rounded-lg">
                            {r.college}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Success Stats */}
            <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {filtered.length}+
                  </div>
                  <p className="text-gray-600">Qualified Students</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Math.min(...filtered.map((r) => r.rank))}
                  </div>
                  <p className="text-gray-600">Best Rank Achieved</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    100%
                  </div>
                  <p className="text-gray-600">Success Rate</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Contact Form */}
      <div className="bg-gray-50">
        <Contact />
      </div>
    </div>
  );
};

export default ResultPage;
