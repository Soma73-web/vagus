import React from "react";
import logoCircle from "../assets/logoCircle.jpg";
import "./SearchLoader.css";

const SearchLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-white">
    <div className="relative flex items-center justify-center w-96 h-48">
      {/* Glowing shadow */}
      <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 blur-2xl animate-pulse"></div>
      {/* Rotating blue ring with modern touch */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full rounded-full border-[10px] border-blue-600 border-t-transparent animate-spin-slow shadow-xl"></div>
      </div>
      {/* Centered logo, fully visible */}
      <img
        src={logoCircle}
        alt="Loader Logo"
        className="relative z-10 w-36 h-36 object-contain rounded-full bg-white shadow-lg"
        style={{ border: "6px solid white" }}
      />
      
      {/* VAGUS text to the left of logo */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 animate-fade-in-emerge">
        <span className="text-2xl font-bold text-blue-800 tracking-wider">VAGUS</span>
      </div>
      
      {/* NEET ACADEMY text to the right of logo */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 animate-fade-in-emerge">
        <span className="text-2xl font-bold text-blue-800 tracking-wider">NEET ACADEMY</span>
      </div>
    </div>
  </div>
);

export default SearchLoader; 