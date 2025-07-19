import React, { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import api from "../api";
import { NextArrow, PrevArrow } from "./BlueArrows";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
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

  if (loading)
    return (
      <section className="py-20 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4">
          <LoadingSpinner message="Our success stories are loading..." />
        </div>
      </section>
    );
  if (testimonials.length === 0)
    return (
      <section className="py-20 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4">
          <EmptyState
            icon="🎬"
            title="Success Stories Coming Soon"
            message="We're collecting inspiring stories from our achievers. Amazing testimonials will be here soon!"
          />
        </div>
      </section>
    );

  return (
    <section id="testimonials" className="py-20 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* ───── New Styled Heading ───── */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-12 h-px bg-blue-500"></div>
            <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase">
              Success&nbsp;Story
            </p>
            <div className="w-12 h-px bg-blue-500"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            See How Our{" "}
            <span className="text-blue-600 underline">Students</span>{" "}
            Cracked&nbsp;NEET&nbsp;&amp;&nbsp;JEE –
            <br className="hidden md:block" />
            Watch Their Stories!
          </h2>
        </div>
        {/* ───────────────────────────── */}

        <Slider {...settings}>
          {testimonials.map((t) => (
            <div key={t.id} className="px-2">
              <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden h-[400px]">
                <div className="md:w-1/2 h-64 md:h-full bg-black">
                  {t.embedUrl ? (
                    <iframe
                      src={t.embedUrl}
                      title={`${t.name} testimonial`}
                      className="w-full h-full"
                      frameBorder="0"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500 text-sm">
                      No video available
                    </div>
                  )}
                </div>

                <div className="md:w-1/2 p-6 flex flex-col justify-between bg-white">
                  <div>
                    {t.message && (
                      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                        “{t.message}”
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-blue-700 font-semibold text-md">
                      {t.name}
                    </p>
                    {t.college && (
                      <p className="text-sm text-gray-500">{t.college}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
