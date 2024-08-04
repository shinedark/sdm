'use client'; // Ensure this is a Client Component

import React from 'react';

const BinaryStatic: React.FC = () => {
  const text = "SHINE DARK";
  const letters = text.split(''); // Split text into individual letters

  // Create a grid of text elements
  const numRows = 30; // Number of rows
  const numCols = 6; // Number of columns

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="static-text">
        {[...Array(numRows)].map((_, rowIndex) => (
          <div key={rowIndex} className="static-row">
            {[...Array(numCols)].map((_, colIndex) => {
              const letterIndex = (rowIndex * numCols + colIndex) % letters.length;
              return (
                <span
                  key={colIndex}
                  className="static-text-item"
                  style={{
                    animationDelay: `${(rowIndex * numCols + colIndex) * 0.05}s`, // Stagger animation start
                  }}
                >
                  {letters[letterIndex]}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <style jsx>{`
        .static-text {
          display: flex;
          // flex-direction: column;
          // width: 100%;
          // height: 100%;
          overflow: hidden;
          // position: absolute;
          color: black;
          // font-size: 3px; /* Adjust font size for tiny letters */
          // line-height: 1;
        }
        
        .static-row {
          display: flex;
          flex-direction: row;
          // width: 100%;
          justify-content: center;
        }
        
        .static-text-item {
          display: inline-block;
          white-space: nowrap;
          margin: 0;
          animation: static 1s infinite;
        }
        
        @keyframes static {
          0% { transform: translateY(0); opacity: 1; }
          25% { transform: translateY(-50%); opacity: 0.5; }
          50% { transform: translateY(0); opacity: 1; }
          75% { transform: translateY(50%); opacity: 0.5; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BinaryStatic;
