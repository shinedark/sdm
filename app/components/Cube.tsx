'use client'; // Ensure this is a Client Component

import React, { useState, useEffect } from 'react';
import './Cube.css'; // Import the CSS
import Monsty from './Monsty';

interface CubeProps {
  isAnimating: boolean;
}

const Cube: React.FC<CubeProps> = ({ isAnimating }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [selectedFace, setSelectedFace] = useState('front');

  const handleRotation = (direction: string) => {
    switch (direction) {
      case 'up':
        setRotateX((prevX) => prevX - 90);
        break;
      case 'down':
        setRotateX((prevX) => prevX + 90);
        break;
      case 'left':
        setRotateY((prevY) => prevY - 90);
        break;
      case 'right':
        setRotateY((prevY) => prevY + 90);
        break;
      default:
        break;
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        handleRotation('up');
        break;
      case 'ArrowDown':
        handleRotation('down');
        break;
      case 'ArrowLeft':
        handleRotation('left');
        break;
      case 'ArrowRight':
        handleRotation('right');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Add event listener for keyboard controls
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="cube-container">
      <div className={`scene ${isAnimating ? 'cube-bounce' : ''}`}>
        <div className="cube" style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}>
          <div className={`cube__face cube__face--front ${selectedFace === 'front' ? 'selected' : ''}`}><Monsty isAnimating={isAnimating} key={1} /></div>
          <div className={`cube__face cube__face--back ${selectedFace === 'back' ? 'selected' : ''}`}><Monsty isAnimating={isAnimating} key={2} /></div>
          <div className={`cube__face cube__face--right ${selectedFace === 'right' ? 'selected' : ''}`}><Monsty isAnimating={isAnimating} key={3} /></div>
          <div className={`cube__face cube__face--left ${selectedFace === 'left' ? 'selected' : ''}`}><Monsty isAnimating={isAnimating} key={4} /></div>
          <div className={`cube__face cube__face--top ${selectedFace === 'top' ? 'selected' : ''}`}><Monsty isAnimating={isAnimating} key={5} /></div>
          <div className={`cube__face cube__face--bottom ${selectedFace === 'bottom' ? 'selected' : ''}`}><Monsty isAnimating={isAnimating} key={6} /></div>
        </div>
      </div>

      {!isAnimating && (
        <div className="controls">
          <button onClick={() => handleRotation('up')}>Up</button>
          <button onClick={() => handleRotation('down')}>Down</button>
          <button onClick={() => handleRotation('left')}>Left</button>
          <button onClick={() => handleRotation('right')}>Right</button>
        </div>
      )}
    </div>
  );
};

export default Cube;
