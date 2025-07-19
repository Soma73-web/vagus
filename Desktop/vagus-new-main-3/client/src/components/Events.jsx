import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/events`);
        // Filter events that have images only
        const eventsWithImages = response.data.filter(
          (event) => event.imageUrl,
        );
        setEvents(eventsWithImages);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Auto-slide effect - change slide every 30 seconds
  useEffect(() => {
    if (events.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % events.length);
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [events.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <LoadingSpinner message="Loading latest events..." />
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <EmptyState
            icon="🎉"
            title="Events Coming Soon"
            message="Stay tuned for exciting events and activities!"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden"
      id="events"
    >
      {/* Full-width image slider */}
      <div className="relative w-full h-full">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={event.imageUrl}
              alt={event.title || "Event"}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Image failed to load:", e.target.src);
              }}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>

            {/* Content overlay */}
            {(event.title || event.description) && (
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="container mx-auto">
                  <div className="max-w-3xl">
                    {event.title && (
                      <h3 className="text-2xl md:text-4xl font-bold mb-4">
                        {event.title}
                      </h3>
                    )}
                    {event.description && (
                      <p className="text-lg md:text-xl opacity-90">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {events.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Slide indicators */}
      {events.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            />
          ))}
        </div>
      )}

      {/* Title section below slider */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Latest Events & Updates
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest announcements, events, and achievements
          </p>
        </div>
      </div>
    </section>
  );
};

export default Events;
