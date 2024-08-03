'use client'; // Ensure this is a Client Component

import { useState } from 'react';
import ImageClip from './ImageClip';
import BinaryStatic from './BinaryStatic';

const Monsty = ({ isAnimating }) => {
  const [showPyramid, setShowPyramid] = useState(true);

  const handleShapeClick = () => {
    setShowPyramid(false);
  };

  const handleHelloClick = () => {
    setShowPyramid(true);
  };

  return (
    <>
      <div className="flex min-h-full flex-col items-center justify-center p-4">
        {showPyramid ? (
          <div
            className="flex flex-col items-center relative group cursor-pointer h-full w-full"
            onClick={handleShapeClick}
          >
            {/* Black Circle with White Mouth */}
            <div className="absolute top-[-2rem] left-1/2 w-12 h-12 bg-black rounded-full transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-6 h-3 bg-white border-2 border-black border-dashed -translate-y-1/2">
                <div className="w-2 h-2 pl-1 rounded-full bg-red-400 animate-spin"></div>
              </div>
              <BinaryStatic />
            </div>

            {/* Top Div */}
            <ImageClip isHovered={false} />

            {/* Bottom Divs with Rhythm Animation */}
            <div className="flex space-x-2 mt-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className={`relative w-12 h-12 bg-black border-4 border-white border-solid shadow-custom ${
                    isAnimating ? 'animate-rhythm' : ''
                  }`}
                >
                  {isAnimating && (
                    <video
                      src="/music/elrit.mov" // Replace with your video file path
                      autoPlay
                      loop
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full bg-yellow-400 border-4 border-black border-dashed flex items-center justify-center cursor-pointer"
            onClick={handleHelloClick}
          >
            <div className="text-xs">Hello</div>
          </div>
        )}
      </div>

      {/* Styles for animation */}
      <style jsx>{`
        @keyframes rhythm {
          0% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(0.6); }
          100% { transform: scale(0.9); }
        }

        .animate-rhythm {
          animation: rhythm 1s infinite;
        }
      `}</style>
    </>
  );
};

export default Monsty;
