import React from "react";
import logoCircle from "../assets/logoCircle.jpg";
import "./SearchLoader.css";

const SearchLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Logo with rotating ring and blur effect */}
        <div className="relative">
          {/* Outer blur/glow effect */}
          <div className="absolute inset-0 w-64 h-64 bg-blue-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          
          {/* Rotating blue ring */}
          <div className="absolute inset-0 w-56 h-56 border-4 border-blue-500 rounded-full animate-spin-slow"></div>
          
          {/* Inner blur circle */}
          <div className="absolute inset-0 w-56 h-56 bg-blue-500 rounded-full blur-lg opacity-40"></div>
          
          {/* Logo image */}
          <img
            src={logoCircle}
            alt="Vagus Logo"
            className="relative w-44 h-44 rounded-full object-cover z-10"
            loading="lazy"
            onLoad={(e) => {
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