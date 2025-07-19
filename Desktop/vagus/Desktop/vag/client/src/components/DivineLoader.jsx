import React, { useState } from "react";

const DivineLoader = ({ message = "Loading..." }) => {
  const [imageSrc, setImageSrc] = useState(
    "https://images.pexels.com/photos/12173961/pexels-photo-12173961.jpeg",
  );

  // Try to load custom image when component mounts
  React.useEffect(() => {
    // Check if custom image exists by trying to load it
    const checkCustomImage = () => {
      const img = new Image();
      img.onload = () => {
        // If the image loads successfully, use it
        setImageSrc("/src/assets/goddess-parvathi.jpg");
      };
      img.onerror = () => {
        // If image doesn't exist, keep using placeholder
        console.log(
          "Custom goddess image not found at /src/assets/goddess-parvathi.jpg, using placeholder",
        );
      };
      // Try to load from public folder first
      img.src = "/goddess-parvathi.jpg";
    };

    checkCustomImage();
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 flex items-center justify-center z-50">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <div className="w-full h-full rounded-full animate-ping"></div>
          </div>
        ))}

        {/* Larger floating elements */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`large-${i}`}
            className="absolute w-4 h-4 bg-gradient-to-r from-rose-300 to-orange-300 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main loading container */}
      <div className="relative flex flex-col items-center">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 w-64 h-64 rounded-full border-4 border-transparent border-t-orange-400 border-r-rose-400 animate-spin"></div>

        {/* Middle pulsing ring */}
        <div
          className="absolute inset-2 w-60 h-60 rounded-full border-2 border-transparent border-l-rose-300 border-b-orange-300 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "3s" }}
        ></div>

        {/* Inner glowing ring */}
        <div className="absolute inset-4 w-56 h-56 rounded-full bg-gradient-to-r from-orange-200 to-rose-200 opacity-20 animate-pulse"></div>

        {/* Goddess Parvathi image container */}
        <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-gradient-to-r from-orange-300 to-rose-300 bg-white">
          {/* Image with divine glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-rose-100 animate-pulse"></div>
          <img
            src={imageSrc}
            alt="Goddess Parvathi"
            className="w-full h-full object-cover animate-fade-in"
            style={{ filter: "sepia(20%) saturate(1.2) brightness(1.1)" }}
            onError={(e) => {
              // Fallback to placeholder if your image fails to load
              console.log("Using fallback image for Goddess Parvathi");
              e.target.src =
                "https://images.pexels.com/photos/12173961/pexels-photo-12173961.jpeg";
              setImageSrc(
                "https://images.pexels.com/photos/12173961/pexels-photo-12173961.jpeg",
              );
            }}
          />

          {/* Divine aura overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-orange-100/20 to-rose-100/30 animate-pulse"></div>
        </div>

        {/* Petals animation */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`petal-${i}`}
            className="absolute w-3 h-6 bg-gradient-to-t from-rose-400 to-orange-400 rounded-full opacity-60"
            style={{
              transformOrigin: "50% 120px",
              transform: `rotate(${i * 30}deg) translateY(-120px)`,
              animation: `float 2s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          ></div>
        ))}

        {/* Om symbol floating around */}
        <div className="absolute inset-0 w-64 h-64">
          {["🕉️", "🪷", "✨"].map((symbol, i) => (
            <div
              key={symbol}
              className="absolute text-2xl opacity-60 animate-float"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateY(-140px) rotate(${-i * 120}deg)`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Loading text */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-2 animate-pulse">
            Seeking Divine Blessings
          </h3>
          <p className="text-lg text-gray-600 animate-fade-in">{message}</p>

          {/* Loading dots */}
          <div className="flex justify-center space-x-2 mt-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Sacred mantras text (decorative) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-sm text-gray-500 opacity-70 font-light tracking-wider animate-pulse">
          ॐ गं गणपतये नमः
        </p>
      </div>
    </div>
  );
};

export default DivineLoader;
