import React from 'react';
import GlobeGallery from './GlobeGallery';
import { imageUrls } from './Images'; // Import the image array
import './ExpandingAnimation.css';

interface ExpandingAnimationProps {
  isExpanded: boolean;
}

const ExpandingAnimation: React.FC<ExpandingAnimationProps> = ({ isExpanded }) => {
  // Select a random image from the array
  const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];

  return (
    <div
      className="expanding-animation-container"
      style={{ backgroundImage: `url(${randomImage})` }}
    >
      <GlobeGallery />
      {/* <div className="expanding-animation-content">
        This is for no reason other than fun
      </div> */}
    </div>
  );
};

export default ExpandingAnimation;
