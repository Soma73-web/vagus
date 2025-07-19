import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import api from "../api";
import { NextArrow, PrevArrow } from "./BlueArrows";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    try {
      const res = await api.get("/api/gallery");
      setImages(res.data || []);
    } catch (err) {
      console.error("Gallery load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <LoadingSpinner message="Our gallery team is preparing visual memories..." />
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <EmptyState
            icon="📸"
            title="Gallery Loading Soon"
            message="Our photography team is capturing beautiful moments. Check back soon for amazing visuals!"
          />
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-12 h-px bg-indigo-500"></div>
            <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
              Gallery
            </p>
            <div className="w-12 h-px bg-indigo-500"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Explore Our{" "}
            <span className="text-indigo-600 underline">Campus</span> Moments
          </h2>
        </div>

        <Slider {...settings}>
          {images.map((img) => (
            <div key={img.id} className="px-2">
              <div className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all relative">
                <img
                  src={`${API_BASE}/api/gallery/image/${img.id}`}
                  alt={img.title || "Gallery Image"}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/fallback.png";
                  }}
                />
                {img.title && (
                  <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white text-sm px-2 py-1">
                    {img.title}
                  </div>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Gallery;
