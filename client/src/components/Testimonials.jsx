import React, { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import axios from "axios";
import { NextArrow, PrevArrow } from "./BlueArrows";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/testimonials`);
      setTestimonials(res.data || []);
    } catch (err) {
      console.error("Testimonials load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchTestimonials();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchTestimonials]);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <LoadingSpinner message="Loading student testimonials..." />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <EmptyState
            icon="💬"
            title="Testimonials Coming Soon"
            message="Our students are preparing their testimonials. Check back soon for amazing feedback!"
          />
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-16 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-12 h-px bg-indigo-500"></div>
            <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
              Testimonials
            </p>
            <div className="w-12 h-px bg-indigo-500"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            What Our{" "}
            <span className="text-indigo-600 underline">Students</span> Say
          </h2>
        </div>

        <Slider {...settings}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="px-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-semibold text-indigo-600">
                      {testimonial.name?.charAt(0) || "S"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name || "Student"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.course || "NEET Student"}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "{testimonial.testimonial || "Great experience studying here!"}"
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
