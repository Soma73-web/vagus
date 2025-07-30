import React from "react";
import logoCircle from "../assets/logoCircle.jpg";
import "./SearchLoader.css";

const SearchLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-white">
    <div className="relative flex items-center justify-center w-96 h-48">
      {/* Glowing shadow - fixed positioning */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-blue-400 opacity-20 blur-2xl animate-pulse"></div>
      {/* Rotating blue ring with modern touch - fixed positioning */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center">
        <div className="w-full h-full rounded-full border-[10px] border-blue-600 border-t-transparent animate-spin-slow shadow-xl"></div>
      </div>
      {/* Centered logo, fully visible */}
      <img
        src={logoCircle}
        alt="Loader Logo"
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-36 h-36 object-contain rounded-full bg-white shadow-lg"
        style={{ border: "6px solid white" }}
      />
      
      {/* VAGUS text to the left of logo - with proper spacing */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 animate-fade-in-emerge">
        <span className="text-2xl font-bold text-blue-800 tracking-wider">VAGUS</span>
      </div>
      
      {/* NEET ACADEMY text to the right of logo - with proper spacing */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 animate-fade-in-emerge">
        <span className="text-2xl font-bold text-blue-800 tracking-wider">NEET ACADEMY</span>
      </div>
    </div>
  </div>
);

export default SearchLoader; 