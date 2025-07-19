// Utility to manage scroll behavior and prevent unwanted scrolling

export const disableScrollRestoration = () => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
};

export const enableScrollRestoration = () => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "auto";
  }
};

export const saveScrollPosition = (key = "main") => {
  sessionStorage.setItem(`scroll-${key}`, window.scrollY);
};

export const restoreScrollPosition = (key = "main") => {
  const savedPosition = sessionStorage.getItem(`scroll-${key}`);
  if (savedPosition) {
    window.scrollTo(0, parseInt(savedPosition, 10));
    sessionStorage.removeItem(`scroll-${key}`);
  }
};

export const scrollToTop = (behavior = "auto") => {
  window.scrollTo({
    top: 0,
    behavior: behavior,
  });
};

// Initialize scroll management
export const initScrollManagement = () => {
  disableScrollRestoration();

  // Clear any existing scroll positions on app start
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith("scroll-")) {
      sessionStorage.removeItem(key);
    }
  });

  // Clear any localStorage scroll values that might be causing issues
  const scrollKeys = ["scrollTo", "scroll_position", "lastScrollPosition"];
  scrollKeys.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  });

  // Ensure page starts at top
  window.scrollTo(0, 0);
};
