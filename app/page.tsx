'use client'; // Ensure this is a Client Component
import { useState, useRef } from 'react';
import Cube from './components/Cube';
import BinaryStatic from './components/BinaryStatic';
import Footer from './components/Footer';
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
        <a
          href="https://www.paypal.com/ncp/payment/RVBUJR3MTSYB2"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed top-4 left-4 w-24 h-12 bg-black text-white flex items-center justify-center rounded-full z-20"
        >
          VINYL
        </a>

        <Cube isAnimating={isAnimating} />
        
        {/* Audio Element */}
        <audio ref={audioRef} src="/music/elritmo.m4a" preload="auto" />
      </main>
      
      <Footer />
    </div>
  );
}
