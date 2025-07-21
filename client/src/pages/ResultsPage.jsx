import React, { useEffect, useState } from "react";
import api from "../api";

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
    <div className="pt-8 bg-white min-h-screen">
      {/* Heading */}
      <div className="max-w-4xl mx-auto px-4 mb-2">
        <h1 className="text-xl md:text-2xl font-bold text-blue-800 mb-1 text-center tracking-tight">Our Achievers</h1>
      </div>

      {/* Year Filter */}
      {years.length > 0 && (
        <div className="flex justify-center flex-wrap gap-2 mb-6 px-2 overflow-x-auto">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelected(year)}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 text-sm md:text-base whitespace-nowrap shadow-sm border-2 ${
                String(selected) === String(year)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-600 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              NEET {year}
            </button>
          ))}
        </div>
      )}

      {/* Results Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading results...</p>
          </div>
        ) : !filtered.length ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Results Coming Soon</h3>
            <p className="text-gray-500">We will update this section as soon as results are available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md border p-4 flex flex-col items-center">
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-full border-2 border-blue-200 mb-3"
                  onError={e => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name); }}
                />
                <div className="text-lg font-semibold text-blue-700 mb-1 text-center">{item.name}</div>
                <div className="text-sm text-gray-600 mb-1 text-center">{item.rank ? `Rank: ${item.rank}` : null}</div>
                <div className="text-xs text-gray-400 text-center">{item.year}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
