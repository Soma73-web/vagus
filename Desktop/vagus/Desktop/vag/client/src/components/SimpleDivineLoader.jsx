import React from "react";

const SimpleDivineLoader = ({ message = "Loading...", size = "medium" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {/* Simple lotus-inspired loader */}
      <div className="relative">
        {/* Petals around the center */}
        <div className={`absolute inset-0 ${sizeClasses[size]}`}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-3 bg-gradient-to-t from-orange-400 to-rose-400 rounded-full opacity-60"
              style={{
                transformOrigin: "50% 24px",
                transform: `rotate(${i * 60}deg) translateY(-24px)`,
                animation: `float 2s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Center circle */}
        <div
          className={`${sizeClasses[size]} border-3 border-orange-200 border-t-orange-500 border-r-rose-500 rounded-full animate-spin mx-auto`}
        ></div>

        {/* Inner glow */}
        <div className="absolute inset-1 bg-gradient-to-r from-orange-100 to-rose-100 rounded-full opacity-30 animate-pulse"></div>
      </div>

      {/* Message */}
      <p className="text-gray-600 font-medium text-sm text-center bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent animate-pulse">
        {message}
      </p>

      {/* Sacred dots */}
      <div className="flex space-x-1">
        <div
          className="w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
};

export default SimpleDivineLoader;
