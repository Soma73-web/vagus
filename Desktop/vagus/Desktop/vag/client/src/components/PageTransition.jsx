import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const PageTransition = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fadeClass, setFadeClass] = useState("opacity-100");
  const location = useLocation();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Skip transition on initial page load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Only show loading for actual route changes, not hash changes
    if (location.hash) {
      return; // Skip loading for hash-only navigation
    }

    // Start transition
    setFadeClass("opacity-0");
    setIsLoading(true);

    // Simulate loading time and then fade in
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFadeClass("opacity-100");
    }, 200); // Reduced loading time

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <LoadingSpinner size="large" message="Loading page..." />
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-300 ease-in-out ${fadeClass}`}>
      {children}
    </div>
  );
};

export default PageTransition;
