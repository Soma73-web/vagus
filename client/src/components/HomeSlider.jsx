import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

const HomeSlider = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/slider`);
        const data = await res.json();
        const formatted = data.map((img) => ({
          ...img,
          url: `${API_BASE.replace(/\/$/, "")}/api/slider/image/${img.id}`,
        }));
        setImages(formatted);
      } catch (error) {
        console.error("Failed to load slider images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSliderImages();
  }, []);

  const settings = {
    dots: true,
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
                  src={img.url}
                  alt={`Slide ${img.id}`}
                  className="w-full h-[280px] sm:h-[230px] object-cover"
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
