import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import api from '../api';
import { NextArrow, PrevArrow } from './BlueArrows';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

const Results = () => {
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

  const filtered = selected ? items.filter((i) => i.year === selected) : [];

  const slick = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section id="results" className="pt-28 pb-16 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4">

        {/* ───── New Styled Heading ───── */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-12 h-px bg-blue-500"></div>
            <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase">
              Results
            </p>
            <div className="w-12 h-px bg-blue-500"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our <span className="text-black">NEET/JEE</span>{' '}
            <span className="text-blue-600 underline">Achievers</span>
          </h2>
        </div>
        {/* ────────────────────────────── */}

        {/* Year Filter */}
        {years.length > 0 && (
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelected(year)}
                className={`px-4 py-1 rounded-full border font-semibold transition duration-200 ${
                  selected === year
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                NEET {year}
              </button>
            ))}
          </div>
        )}

        {/* Loading / Empty / Results */}
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading results…</p>
        ) : !filtered.length ? (
          <p className="text-center py-10 text-gray-500">
            No results found for <span className="font-semibold">NEET {selected}</span>
          </p>
        ) : (
          <Slider {...slick}>
            {filtered.map((r) => (
              <div key={r.id} className="p-2">
                <div className="rounded-xl text-center shadow-xl bg-white p-5 hover:shadow-2xl transition duration-300">
                  <img
                    src={r.photoUrl}
                    alt={r.name}
                    loading="lazy"
                    className="w-36 h-36 md:w-40 md:h-40 object-cover mx-auto rounded-full border-4 border-yellow-400 mb-3"
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
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default Results;
