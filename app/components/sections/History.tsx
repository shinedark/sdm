'use client';

import React from 'react';
import GlobeGallery from '../GlobeGallery';

const History: React.FC = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animated-heading {
          animation: fadeInOut 9s ease-in-out infinite;
          top: 50vh;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
      <h1 
        className="text-4xl font-bold mb-8 text-center pt-8 fixed animated-heading" 
      >
        {`EL ARCHIVO`}
      </h1>
      <div className="w-full h-[calc(100vh-8rem)]">
        <GlobeGallery />
      </div>
    </div>
  );
};

export default History; 