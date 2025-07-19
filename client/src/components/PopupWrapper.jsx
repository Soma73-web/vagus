import React from 'react';
import Popup from './Popup';
import { usePopup } from '../hooks/usePopup';

const PopupWrapper = () => {
  const { popupData, isOpen, closePopup } = usePopup();

  return (
    <Popup
      isOpen={isOpen}
      onClose={closePopup}
      popupData={popupData}
    />
  );
};

export default PopupWrapper; 