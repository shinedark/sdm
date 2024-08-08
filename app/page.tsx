'use client'; // Ensure this is a Client Component
import React, { useState, useRef } from 'react';
import Cube from './components/Cube';
import BinaryStatic from './components/BinaryStatic';
import Footer from './components/Footer';
import Vinyl from './components/Vinyl';
import './globals.css';

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVinyl, setShowVinyl] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleNoiseClick = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        setIsAnimating(true);
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        setIsAnimating(false);
      }
    }
  };

  const toggleVinylOverlay = () => {
    setShowVinyl(!showVinyl);
  };

  const closeVinylOverlay = () => {
    setShowVinyl(false);
  };

  return (
    <div className="flex flex-col min-h-screen relative z-0">
      <main className="flex flex-1 items-center justify-center p-0 z-10">
        <BinaryStatic />
        
        {/* NOISE Button */}
        <button
          className="fixed top-4 right-4 w-24 h-12 bg-black text-white flex items-center justify-center rounded-full z-20"
          onClick={handleNoiseClick}
        >
          NOISE
        </button>
        
        {/* VINYL Button */}
        <button
          onClick={toggleVinylOverlay}
          className="fixed top-4 left-4 w-24 h-12 bg-black text-white flex items-center justify-center rounded-full z-20"
        >
          VINYL
        </button>

        <img
          src="/images/6.png" // Replace with your image path
          alt="Vinyl Icon"
          className="mt-2 w-12 h-16 absolute top-10 left-10"
        />

        <Cube isAnimating={isAnimating} />
        
        {/* Audio Element */}
        <audio ref={audioRef} src="/music/elritmo.m4a" preload="auto" />
      </main>

      <Footer />

      {/* Vinyl Overlay */}
      {showVinyl && (
        <Vinyl onClose={closeVinylOverlay} />
      )}
    </div>
  );
}
