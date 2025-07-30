import React, { useState, useEffect, useCallback } from "react";
import Slider from "react-slick";
import axios from "axios";
import { NextArrow, PrevArrow } from "./BlueArrows";
import LoadingSpinner from "./LoadingSpinner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EmptyState from "./EmptyState";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const HomeSlider = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/slider`);
      const data = response.data.map((img) => ({
        ...img,
        imageUrl: `${API_BASE}/api/slider/image/${img.id}`,
      }));
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching slider images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="mb-8">
      {loading ? (
        <LoadingSpinner message="Our team is setting up the latest showcase..." />
      ) : images.length === 0 ? (
        <EmptyState
          icon="🖼️"
          title="Showcase Coming Soon"
          message="Our team is working on bringing you the latest updates and highlights"
        />
      ) : (
        <div className="w-full max-w-screen-2xl mx-auto overflow-hidden">
          <Slider {...settings}>
            {images.map((img) => (
              <div key={img.id}>
                <img
                  src={img.imageUrl}
                  alt={`Slide ${img.id}`}
                  className="w-full h-[230px] object-cover"
                  onError={e => { e.target.onerror = null; e.target.src = '/fallback.png'; }}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default HomeSlider;
