import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";

const WhatsAppFloat = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show button after a short delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show tooltip after button appears
    if (isVisible) {
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(true);
        // Hide tooltip after 3 seconds
        setTimeout(() => setShowTooltip(false), 3000);
      }, 1000);
      return () => clearTimeout(tooltipTimer);
    }
  }, [isVisible]);

  const handleWhatsAppClick = () => {
    const phoneNumber = "917353049113"; // Replace with actual number
    const message = "Hello! I would like to know more about your courses.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    setShowTooltip(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* WhatsApp Float Button */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        {/* Tooltip */}
        {showTooltip && !isExpanded && (
          <div className="absolute bottom-16 right-0 mb-2 animate-slide-up">
            <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              Need help? Chat with us!
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        )}

        {/* Expanded Chat Panel */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 w-80 max-w-[90vw] bg-white rounded-lg shadow-2xl border border-gray-200 animate-scale-in">
            <div className="bg-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaWhatsapp size={24} />
                <div>
                  <h3 className="font-semibold text-sm">VAGUS Institute</h3>
                  <p className="text-xs opacity-90">
                    Typically replies in minutes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white hover:bg-green-600 p-1 rounded transition-colors"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="bg-gray-100 p-3 rounded-lg text-sm">
                <p className="font-medium text-gray-800">Hi there! 👋</p>
                <p className="text-gray-600 mt-1">
                  How can we help you today? Ask us about our NEET/JEE courses!
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    const message = "I want to know about NEET courses";
                    const whatsappURL = `https://wa.me/917353049113?text=${encodeURIComponent(message)}`;
                    window.open(whatsappURL, "_blank");
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors text-sm"
                >
                  📚 NEET Courses Information
                </button>

                <button
                  onClick={() => {
                    const message = "I want to know about JEE courses";
                    const whatsappURL = `https://wa.me/917353049113?text=${encodeURIComponent(message)}`;
                    window.open(whatsappURL, "_blank");
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors text-sm"
                >
                  🎯 JEE Courses Information
                </button>

                <button
                  onClick={() => {
                    const message = "I want to know about admission process";
                    const whatsappURL = `https://wa.me/917353049113?text=${encodeURIComponent(message)}`;
                    window.open(whatsappURL, "_blank");
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors text-sm"
                >
                  📝 Admission Process
                </button>

                <button
                  onClick={() => {
                    const message = "I want to schedule a visit";
                    const whatsappURL = `https://wa.me/917353049113?text=${encodeURIComponent(message)}`;
                    window.open(whatsappURL, "_blank");
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors text-sm"
                >
                  🏢 Schedule a Visit
                </button>
              </div>

              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
              >
                💬 Start Custom Chat
              </button>
            </div>
          </div>
        )}

        {/* Main WhatsApp Button */}
        <button
          onClick={handleExpand}
          className="bg-green-500 hover:bg-green-600 text-white p-3 md:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-float relative group"
          aria-label="Contact us on WhatsApp"
        >
          <FaWhatsapp size={24} className="md:text-2xl" />

          {/* Pulse animation ring */}
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
          <div
            className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-10"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </button>
      </div>
    </>
  );
};

export default WhatsAppFloat;
