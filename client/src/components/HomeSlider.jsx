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
      console.log("Slider API response:", response.data);
      
      // Ensure we have unique images and proper data structure
      const data = response.data
        .filter((img, index, self) => self.findIndex(t => t.id === img.id) === index) // Remove duplicates
        .map((img) => ({
          ...img,
          imageUrl: `${API_BASE}/api/slider/image/${img.id}`,
        }));
      
      console.log("Processed slider images:", data);
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
    dots: images.length > 1,
    arrows: images.length > 1,
    infinite: images.length > 1,
    speed: 800,
    autoplay: images.length > 1,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    fade: true,
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
            {images.map((img, index) => (
              <div key={`${img.id}-${index}`}>
                <img
                  src={img.imageUrl}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-[230px] object-cover"
                  onError={(e) => { 
                    console.error(`Failed to load image ${img.id}:`, e);
                    e.target.onerror = null; 
                    e.target.src = '/fallback.png'; 
                  }}
                  onLoad={() => console.log(`Image ${img.id} loaded successfully`)}
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
