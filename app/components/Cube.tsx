'use client'; // Ensure this is a Client Component

import React, { useState } from 'react';
import './Cube.css'; // Import the CSS
import Monsty from './Monsty';

const Cube = ({ isAnimating }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [step, setStep] = useState(0); // To keep track of the rotation sequence

  const handleCubeClick = () => {
    // Define the sequence of rotations
    const rotations = [
      { x: 0, y: 0 },     // Front
      { x: 0, y: 90 },    // Right
      { x: 0, y: 180 },   // Back
      { x: 0, y: -90 },   // Left
      { x: 90, y: 0 },    // Top
      { x: -90, y: 0 },   // Bottom
    ];

    // Get the next rotation based on the step
    const nextRotation = rotations[step];

    setRotateX(nextRotation.x);
    setRotateY(nextRotation.y);

    // Update step, reset to 0 after the last step
    setStep((prevStep) => (prevStep + 1) % rotations.length);
  };

  return (
    <div className={`scene ${isAnimating ? 'cube-bounce' : ''}`} onClick={handleCubeClick}>
      <div className="cube" style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}>
        <div className="cube__face cube__face--front"><Monsty isAnimating={isAnimating} key={1} /></div>
        <div className="cube__face cube__face--back"><Monsty isAnimating={isAnimating}  key={2} /></div>
        <div className="cube__face cube__face--right"><Monsty isAnimating={isAnimating} key={3}  /></div>
        <div className="cube__face cube__face--left"><Monsty isAnimating={isAnimating} key={4}  /></div>
        <div className="cube__face cube__face--top"><Monsty isAnimating={isAnimating}  key={5} /></div>
        <div className="cube__face cube__face--bottom"><Monsty isAnimating={isAnimating} key={6}  /></div>
      </div>
    </div>
  );
};

export default Cube;
