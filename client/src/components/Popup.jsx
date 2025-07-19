import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Popup = ({ isOpen, onClose, popupData }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay for smooth animation
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="flex flex-col lg:flex-row">
          {/* Left Section - Event Details */}
          <div className="lg:w-1/2 p-8 lg:p-10">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Medical Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>

            {/* Event Title */}
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 leading-tight">
              {popupData?.title || "NEET Success Workshop: From Preparation to Achievement"}
            </h2>

            {/* Speaker Info */}
            <div className="mb-8">
              <p className="text-green-600 font-semibold text-sm mb-2">SPEAKER:</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {popupData?.speaker || "Dr. Sarah Johnson"}
              </h3>
              <p className="text-gray-600 text-sm">
                {popupData?.affiliation || "Senior Medical Officer, AIIMS Delhi"}
              </p>
            </div>

            {/* Event Description */}
            {popupData?.description && (
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed">
                  {popupData.description}
                </p>
              </div>
            )}

            {/* Contact Button */}
            <Link
              to="/contact"
              onClick={onClose}
              className="inline-block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl text-center transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg"
            >
              Contact Us
            </Link>
          </div>

          {/* Right Section - Speaker Image */}
          <div className="lg:w-1/2 relative">
            <div className="h-full min-h-[300px] lg:min-h-[400px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-r-2xl lg:rounded-r-2xl lg:rounded-l-none overflow-hidden">
              <img
                src={popupData?.id ? `${process.env.REACT_APP_API_BASE_URL || ''}/api/popup/${popupData.id}/image` : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                alt={popupData?.speaker || "Medical Professional"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup; 