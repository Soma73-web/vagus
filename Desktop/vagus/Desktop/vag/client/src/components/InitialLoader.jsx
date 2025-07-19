import React, { useState, useEffect } from "react";
import DivineLoader from "./DivineLoader";

const InitialLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Invoking Divine Grace...",
  );

  useEffect(() => {
    const messages = [
      "Invoking Divine Grace...",
      "Preparing Sacred Knowledge...",
      "Loading Educational Excellence...",
      "Setting Up Your Journey...",
      "Welcome to VAGUS Institute...",
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingMessage(messages[messageIndex]);
    }, 1000);

    // Minimum loading time to show the beautiful animation
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(messageInterval);
    }, 4000); // 4 seconds of divine loading

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(messageInterval);
    };
  }, []);

  if (isLoading) {
    return <DivineLoader message={loadingMessage} />;
  }

  return children;
};

export default InitialLoader;
