'use client'; // Add this directive to make this component a Client Component

import React from 'react';

interface ImageClipProps {
  isAnimating: boolean; // Prop to control animation effect
}

const ImageClip: React.FC<ImageClipProps> = ({ isAnimating }) => {
  return (
    <div className="relative flex items-center justify-center">
      <picture className="w-20 aspect-[1/cos(30deg)]">
        <img
          rel="prefetch"
          src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjRqcHBzc21odm96dTd2bXFuOW5tN2UxandxOXRlbmxjdGs5YjdkNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohs4CacylzFaHjMM8/giphy.gif" // Replace with your image path
          alt="Clipped"
          className={`w-full h-full object-cover'}`}
          style={{
            clipPath: `polygon(50% 0, 100% 100%, 0 100%, 50% 0, 50% var(--b), calc(var(--b)*cos(30deg)) calc(100% - var(--b)/2), calc(100% - var(--b)*cos(30deg)) calc(100% - var(--b)/2), 50% var(--b))`,
            background: 'linear-gradient(45deg, white, black)',
          }}
        />
      </picture>
      <style jsx>{`
        :global(img) {
          --b: 3px; /* Initial border thickness */
        }
        .hover-effect {
          --b: 50px; /* Change border thickness when animating or hovered */
        }
        picture:hover img {
          --b: 50px; /* Change border thickness on hover */
        }
      `}</style>
    </div>
  );
};

export default ImageClip;
