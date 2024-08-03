'use client'; // Ensure this is a Client Component

import { useState, useEffect } from 'react';

const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      setIndex((prev) => (prev + 1) % text.length);

      // Reset text if we reach the end
      if (index === text.length - 1) {
        setDisplayedText('');
      }
    }, 100); // Adjust the speed by changing the interval time

    return () => clearInterval(interval);
  }, [index, text]);

  return (
    <div className="typing-effect">
      <span>{displayedText}</span>
      <span className="cursor">|</span>

      {/* Styles */}
      <style jsx>{`
        .typing-effect {
          font-size: 1rem;
          white-space: nowrap;
          overflow: hidden;
        }

        .cursor {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TypingEffect;
