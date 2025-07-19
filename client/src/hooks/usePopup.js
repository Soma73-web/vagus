import { useState, useEffect } from 'react';
import api from '../api';

export const usePopup = () => {
  const [popupData, setPopupData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const response = await api.get('/api/popup/active');
        setPopupData(response.data);
      } catch (error) {
        // No active popup or error - don't show popup
        console.log('No active popup found');
      }
    };

    fetchPopup();
  }, []);

  useEffect(() => {
    if (popupData && !hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
      }, (popupData.displayDelay || 5) * 1000);

      return () => clearTimeout(timer);
    }
  }, [popupData, hasShown]);

  const closePopup = () => {
    setIsOpen(false);
  };

  return {
    popupData,
    isOpen,
    closePopup
  };
}; 