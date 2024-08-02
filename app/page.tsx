// app/page.tsx

'use client'; // Ensure this is a Client Component

import { useState } from 'react';
import ImageClip from './components/ImageClip';

export default function Home() {
  const [showPyramid, setShowPyramid] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);

  const handleButtonClick = () => {
    setStartAnimation(true);
  };

  const handleAnimationEnd = () => {
    setShowPyramid(false);
     // Hide pyramid after animation ends
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24" onClick={handleButtonClick}>
      {/* Button to start animation */}


      {showPyramid ? (
        <div
          className={`flex flex-col items-center relative group ${startAnimation ? 'animate-rotateLeft' : ''}`}
          onAnimationEnd={() => {
            handleAnimationEnd();
          }}
        >
          {/* Black Circle with White Mouth */}
          <div className="absolute top-[-3rem] left-1/2 w-24 h-24 bg-black rounded-full transform -translate-x-1/2 flex items-center justify-center">
            <div className="w-12 h-6 bg-white border-4 border-black border-dashed -translate-y-1/2">
              <div className="w-3 h-3 pl-3 rounded-full bg-red-400 animate-spin"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center w-[50vw] absolute top-10 left-1/8 transform -translate-x-1/2 flex justify-center">
  SHINE DARK MUSIC
</h1>

          {/* Top Div */}
          <ImageClip />

          {/* Bottom Divs */}
          <div className="flex space-x-4 mt-8">
            <div className="w-24 h-24 bg-black border-8 border-white border-solid shadow-custom"></div>
            <div className="w-24 h-24 bg-black border-8 border-white border-solid shadow-custom"></div>
          </div>
        </div>
      ) : (
        <div className="w-64 h-64 bg-gray-200 border-4 border-black border-dashed flex items-center justify-center">
          <div className="text-xl">Hello</div>
        </div>
      )}

      {/* Styles for animation */}
      <style jsx>{`
        .animate-rotateLeft {
          animation: rotateLeft 1s ease-in-out;
        }

        @keyframes rotateLeft {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </main>
  );
}
