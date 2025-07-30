import React, { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const HomeSlider = () => {
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSliderImages = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/slider`);
      setSliderImages(res.data || []);
    } catch (err) {
      console.error("Slider load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSliderImages();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchSliderImages();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchSliderImages]);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: "linear",
  };

  if (loading) {
    return (
      <div className="h-96 bg-gray-100 flex items-center justify-center">
        <LoadingSpinner message="Loading slider images..." />
      </div>
    );
  }

  if (sliderImages.length === 0) {
    return (
      <div className="h-96 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Vagus NEET Academy</h1>
          <p className="text-xl">Your journey to medical excellence starts here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Slider {...settings}>
        {sliderImages.map((image) => (
          <div key={image.id} className="relative">
            <img
              src={`${API_BASE}/api/slider/image/${image.id}`}
              alt="Slider Image"
              className="w-full h-96 md:h-[500px] object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/fallback-slider.jpg";
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Vagus NEET Academy
                </h1>
                <p className="text-xl md:text-2xl mb-6">
                  Your Gateway to Medical Excellence
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeSlider;
