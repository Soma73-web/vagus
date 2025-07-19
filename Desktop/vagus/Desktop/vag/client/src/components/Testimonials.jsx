import React, { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import api from "../api";
import { NextArrow, PrevArrow } from "./BlueArrows";
import LoadingSpinner from "./LoadingSpinner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const convertToEmbed = useCallback((url) => {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    try {
      const u = new URL(trimmed);
      if (u.hostname === "youtu.be")
        return `https://www.youtube.com/embed${u.pathname}`;
      if (u.pathname.startsWith("/shorts/"))
        return `https://www.youtube.com/embed${u.pathname.replace("/shorts", "")}`;
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : trimmed;
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/api/testimonials");
        const data = res.data.map((t) => ({
          ...t,
          embedUrl: convertToEmbed(t.video_link),
        }));
        setTestimonials(data);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [convertToEmbed]);

  const settings = {
    dots: true,
    arrows: true,
    infinite: testimonials.length > 2,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [{ breakpoint: 1024, settings: { slidesToShow: 1 } }],
  };

  if (loading) {
    return (
      <section
        id="testimonials"
        className="pt-28 pb-16 bg-gradient-to-b from-indigo-50 to-white scroll-mt-24"
      >
        <div className="container-responsive">
          <LoadingSpinner
            size="large"
            message="Gathering Success Stories..."
            divine={true}
          />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section
        id="testimonials"
        className="pt-28 pb-16 bg-gradient-to-b from-indigo-50 to-white scroll-mt-24"
      >
        <div className="container-responsive text-center py-20">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            Success Stories Coming Soon
          </h3>
          <p className="text-gray-500">
            We're collecting amazing success stories from our students.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      className="pt-28 pb-16 bg-gradient-to-b from-indigo-50 to-white scroll-mt-24"
    >
      <div className="container-responsive">
        {/* Enhanced Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-px bg-indigo-500"></div>
            <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
              Success Stories
            </p>
            <div className="w-16 h-px bg-indigo-500"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            See How Our <span className="gradient-text">Students</span>
            <br className="hidden md:block" />
            Cracked NEET & JEE
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Watch inspiring success stories from our students who achieved their
            dreams with our expert guidance and comprehensive preparation.
          </p>
          <div className="section-divider mt-6"></div>
        </div>

        <div className="animate-slide-up">
          <Slider {...settings}>
            {testimonials.map((t, index) => (
              <div key={t.id} className="px-3">
                <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-[450px] card-hover">
                  {/* Video Section */}
                  <div className="h-64 bg-gradient-to-br from-indigo-900 to-purple-900 relative overflow-hidden">
                    {t.embedUrl ? (
                      <iframe
                        src={t.embedUrl}
                        title={`${t.name} testimonial`}
                        className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                        frameBorder="0"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-white">
                        <div className="text-4xl mb-2">🎥</div>
                        <p className="text-sm opacity-80">Video coming soon</p>
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    {t.embedUrl && (
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <div className="w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6 h-48 flex flex-col justify-between">
                    <div>
                      {t.message && (
                        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-4 text-sm">
                          "{t.message}"
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {t.name}
                          </p>
                          {t.college && (
                            <p className="text-xs text-gray-500 leading-tight">
                              {t.college}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
