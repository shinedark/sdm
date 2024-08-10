import React from 'react';
import { imageUrls } from './Images'; // Import the image array
import './ExpandingAnimation.css';

const ExpandingAnimation: React.FC = () => {
  // Select a random image from the array
  const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];

  return (
    <div
      className="expanding-animation-container"
      style={{ backgroundImage: `url(${randomImage})` }}
    >
      <div className="expanding-animation-content">
        This is for no reason other than fun
      </div>
    </div>
  );
};

export default ExpandingAnimation;
