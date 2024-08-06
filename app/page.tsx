'use client'; // Ensure this is a Client Component
import { useState, useRef, useEffect } from 'react';
import Cube from './components/Cube';
import BinaryStatic from './components/BinaryStatic';
import './globals.css';

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleNoiseClick = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-0">
      <BinaryStatic />
      
      {/* NOISE Button */}
      <button
        className="fixed top-4 right-4 w-24 h-12 bg-black text-white flex items-center justify-center rounded-full z-10"
        onClick={handleNoiseClick}
      >
        NOISE
      </button>
      
      {/* VINYL Button */}
      <a
        href="https://www.paypal.com/ncp/payment/RVBUJR3MTSYB2"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 left-4 w-24 h-12 bg-black text-white flex items-center justify-center rounded-full z-10"
      >
        VINYL
      </a>

      <Cube isAnimating={isAnimating} />
      
      {/* Audio Element */}
      <audio ref={audioRef} src="/music/elritmo.m4a" preload="auto" />
    </main>
  );
}
