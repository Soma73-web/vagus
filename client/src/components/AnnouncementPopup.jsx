import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const AnnouncementPopup = () => {
  const [popup, setPopup] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const fetchActivePopup = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/popup-announcements/active`,
        );
        if (response.data) {
          setPopup(response.data);

          // Check if user has already dismissed this popup today
          const dismissedPopupId = localStorage.getItem("dismissedPopupId");
          const dismissedDate = localStorage.getItem("dismissedPopupDate");
          const today = new Date().toDateString();

          if (
            dismissedPopupId !== response.data.id.toString() ||
            dismissedDate !== today
          ) {
            setTimeout(() => setIsVisible(true), 1000); // Show after 1 second delay
          }
        }
      } catch (error) {
        console.error("Failed to fetch popup:", error);
      }
    };

    fetchActivePopup();
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);

      // Remember that user dismissed this popup today
      if (popup) {
        localStorage.setItem("dismissedPopupId", popup.id.toString());
        localStorage.setItem("dismissedPopupDate", new Date().toDateString());
      }
    }, 300); // Animation duration
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible || !popup) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-lg"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image */}
          <div className="relative">
            <img
              src={popup.imageUrl}
              alt={popup.title}
              className="w-full h-64 md:h-80 object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Announcement type badge */}
          {popup.announcementType && (
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  popup.announcementType === "admission"
                    ? "bg-green-100 text-green-800"
                    : popup.announcementType === "achievement"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {popup.announcementType === "admission" && "🎓 Admission"}
                {popup.announcementType === "achievement" && "🏆 Achievement"}
                {popup.announcementType === "general" && "📢 Announcement"}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {popup.title}
          </h2>

          {/* Description */}
          <div className="text-gray-600 leading-relaxed mb-6">
            {popup.description.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              {popup.announcementType === "admission"
                ? "Learn More"
                : "Got it!"}
            </button>
            <button
              onClick={handleClose}
              className="sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPopup;
