// src/components/ScrollToHash.jsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();
  const isInitialLoad = useRef(true);
  const lastHash = useRef(hash);
  const lastPathname = useRef(pathname);

  useEffect(() => {
    // Reset scroll position to top on page change (not hash change)
    if (pathname !== lastPathname.current && pathname !== "/") {
      window.scrollTo({ top: 0, behavior: "auto" });
      lastPathname.current = pathname;
      isInitialLoad.current = false;
      return;
    }

    lastPathname.current = pathname;

    // Handle hash scrolling only if hash actually changed or on initial load with hash
    if (!hash || (hash === lastHash.current && !isInitialLoad.current)) {
      // If no hash and we're on homepage, scroll to top
      if (!hash && pathname === "/" && !isInitialLoad.current) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      isInitialLoad.current = false;
      return;
    }

    lastHash.current = hash;

    const scrollToTarget = (attempts = 0) => {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);

      if (el) {
        const headerHeight = 96; // Height of fixed header
        const elementPosition = el.offsetTop - headerHeight - 20; // Extra padding

        window.scrollTo({
          top: elementPosition,
          behavior: isInitialLoad.current ? "auto" : "smooth", // No smooth scroll on initial load
        });
      } else if (attempts < 10) {
        // Retry if element not found yet (may still be loading)
        setTimeout(() => scrollToTarget(attempts + 1), 150);
      } else {
        console.warn(
          `Element with id "${id}" not found after multiple attempts`,
        );
      }
    };

    // Delay for initial load to allow components to mount, immediate for hash changes
    const delay = isInitialLoad.current ? 500 : 100;
    setTimeout(() => scrollToTarget(), delay);

    isInitialLoad.current = false;
  }, [hash, pathname]);

  return null;
};

export default ScrollToHash;
