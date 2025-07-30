import React from "react";
import logoCircle from "../assets/logoCircle.jpg";
import "./SearchLoader.css";

const SearchLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Logo with rotating ring */}
        <div className="relative">
          {/* Rotating blue ring */}
          <div className="absolute inset-0 w-48 h-48 border-4 border-blue-500 rounded-full animate-spin-slow"></div>
          
          {/* Blur circle effect */}
          <div className="absolute inset-0 w-48 h-48 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
          
          {/* Logo image with lazy loading */}
          <img
            src={logoCircle}
            alt="Vagus Logo"
            className="relative w-36 h-36 rounded-full object-cover z-10"
            loading="lazy"
            onLoad={(e) => {
              // Prevent layout shift by ensuring image is loaded
              e.target.style.opacity = '1';
            }}
            style={{ opacity: 0, transition: 'opacity 0.3s ease-in' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchLoader; 