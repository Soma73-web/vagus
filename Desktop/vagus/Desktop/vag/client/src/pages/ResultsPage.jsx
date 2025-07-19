import React, { useEffect, useState } from 'react';
import api from '../api';
import Contact from './ContactPage';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

const ResultPage = () => {
  const [items, setItems] = useState([]);
  const [years, setYears] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/api/results');
        const data = res.data.map((r) => ({
          ...r,
          photoUrl: `${API_BASE}/api/results/${r.id}/image`,
        }));
        setItems(data);

        const ys = [...new Set(data.map((r) => r.year))].sort((a, b) => b - a);
        setYears(ys);
        setSelected(ys[0] ?? null);
      } catch (err) {
        console.error('Failed to load results:', err);
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
    <div className="pt-20 bg-white min-h-screen">
      {/* Banner */}
      <div className="w-full bg-blue-600 py-10">
        <h1 className="text-white text-center text-4xl font-bold tracking-wide">
          RESULTS
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Year Filter */}
        {years.length > 0 && (
          <div className="flex justify-center flex-wrap mb-12">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelected(year)}
                className={`px-6 py-2 border-2 font-bold rounded-t-lg mx-1 mb-2 transition duration-200 ${
                  String(selected) === String(year)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                }`}
              >
                NEET {year}
              </button>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading results…</p>
        ) : !filtered.length ? (
          <p className="text-center py-10 text-gray-500">
            No results found for <span className="font-semibold">NEET {selected}</span>
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl text-center shadow-md p-5 hover:shadow-xl transition"
              >
                <img
                  src={r.photoUrl}
                  alt={r.name}
                  loading="lazy"
                  className="w-32 h-32 object-cover mx-auto rounded-lg border-4 border-yellow-400 mb-3"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/fallback.png';
                  }}
                />
                <h4 className="text-lg font-bold uppercase">{r.name}</h4>
                <p className="text-sm font-medium text-gray-700">Rank {r.rank}</p>
                {r.college && (
                  <p className="inline-block bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded mt-2">
                    {r.college}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Form */}
      <div className="mt-20">
        <Contact />
      </div>
    </div>
  );
};

export default ResultPage;
