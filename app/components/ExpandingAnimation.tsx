import React from 'react';
import GlobeGallery from './GlobeGallery';
import { imageUrls } from './Images'; // Import the image array
import './ExpandingAnimation.css';
import { ExpandableCard } from './ExpandableCard';

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
      {/* <GlobeGallery /> */}
     
      <div className="expanding-animation-content">
        
      <iframe width="560" height="315" src="https://www.youtube.com/embed/HxA_BKCzASE?si=FGRW7L5luL_Vuc_Q" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      </div>
    </div>
  );
};

export default ExpandingAnimation;
