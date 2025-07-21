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
          <>
            {/* Heading Row */}
            <div className="hidden md:grid grid-cols-3 gap-6 mb-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div>Photo</div>
              <div>Name</div>
              <div>College</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md border p-4 flex flex-col items-center md:grid md:grid-cols-3 md:items-center md:gap-4">
                  {/* Photo */}
                  <div className="flex justify-center items-center w-24 h-24 md:w-20 md:h-20 bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-200 shadow-sm">
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name); }}
                    />
                  </div>
                  {/* Name */}
                  <div className="mt-2 md:mt-0 text-base font-semibold text-blue-700 text-center md:text-left md:col-span-1">{item.name}</div>
                  {/* College */}
                  <div className="text-sm text-yellow-600 text-center md:text-left md:col-span-1 font-medium">{item.college || <span className='text-gray-300'>—</span>}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
