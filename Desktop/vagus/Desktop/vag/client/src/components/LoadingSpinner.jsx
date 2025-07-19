import React from "react";

const LoadingSpinner = ({
  size = "medium",
  message = "Loading...",
  divine = false,
}) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  if (divine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] space-y-6 p-8">
        {/* Divine lotus inspired loader */}
        <div className="relative">
          {/* Outer petals */}
          <div className="absolute inset-0 w-24 h-24">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-6 bg-gradient-to-t from-orange-400 to-rose-400 rounded-full opacity-70"
                style={{
                  transformOrigin: "50% 48px",
                  transform: `rotate(${i * 45}deg) translateY(-48px)`,
                  animation: `float 2s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Center spinning element */}
          <div
            className={`${sizeClasses[size]} border-4 border-orange-200 border-t-orange-500 border-r-rose-500 rounded-full animate-spin mx-auto`}
          ></div>

          {/* Divine glow */}
          <div className="absolute inset-2 bg-gradient-to-r from-orange-300 to-rose-300 rounded-full opacity-20 animate-pulse"></div>
        </div>

        {/* Sacred message */}
        <div className="text-center">
          <p className="text-gray-700 font-medium animate-pulse text-sm lg:text-base bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            {message}
          </p>

          {/* Om symbol */}
          <div className="text-2xl mt-2 animate-pulse">🕉️</div>
        </div>

        {/* Sacred dots */}
        <div className="flex space-x-2">
          <div
            className="w-2 h-2 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      {/* Modern spinning animation */}
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin`}
        ></div>
        <div
          className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-indigo-400 rounded-full animate-spin`}
          style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
        ></div>
      </div>

      {/* Loading message with fade animation */}
      <p className="text-gray-600 font-medium animate-pulse text-sm lg:text-base">
        {message}
      </p>

      {/* Dots animation */}
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
