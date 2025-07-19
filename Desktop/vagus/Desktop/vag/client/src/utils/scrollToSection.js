export const scrollToSection = (id, callback) => {
  // Function to attempt scrolling with retries
  const attemptScroll = (attempts = 0) => {
    const el = document.getElementById(id);
    if (el) {
      const headerHeight = 96; // Height of fixed header
      const elementPosition = el.offsetTop - headerHeight - 20; // Extra padding

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });

      // Call callback if provided (useful for analytics or state updates)
      if (callback) {
        setTimeout(callback, 600); // After scroll animation completes
      }

      // Update URL hash without jumping (only if different from current)
      if (window.location.hash !== `#${id}` && window.history.pushState) {
        window.history.pushState(null, null, `#${id}`);
      }
    } else if (attempts < 5) {
      // Retry if element not found yet (may still be loading)
      setTimeout(() => attemptScroll(attempts + 1), 200);
    } else {
      console.warn(`Element with id "${id}" not found after multiple attempts`);
    }
  };

  attemptScroll();
};

// Alternative function for smooth scrolling with offset
export const scrollToElement = (element, offset = 96) => {
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  }
};

// Function to check if element is in viewport
export const isElementInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
