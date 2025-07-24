import React from "react";
import "./SearchLoader.css";

const SearchLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[200px]">
    <div className="relative w-16 h-16">
      {/* Glowing circle */}
      <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 blur-xl animate-pulse"></div>
      {/* Magnifying glass */}
      <svg
        className="relative z-10 w-16 h-16 animate-spin-slow"
        viewBox="0 0 64 64"
        fill="none"
      >
        <circle
          cx="28"
          cy="28"
          r="16"
          stroke="#2563eb"
          strokeWidth="4"
          className="opacity-80"
        />
        <line
          x1="41"
          y1="41"
          x2="60"
          y2="60"
          stroke="#2563eb"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <div className="mt-4 text-blue-700 font-semibold text-lg tracking-wide">
      Loading...
    </div>
  </div>
);

export default SearchLoader; 