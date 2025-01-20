'use client';
import React, { useState, useRef, Suspense } from 'react';
import Cube from './components/Cube';
import Image from 'next/image';
import BinaryStatic from './components/BinaryStatic';
import Footer from './components/Footer';
import Vinyl from './components/Vinyl';
import WeedPlant from './components/WeedPlant';
import PlantToJeans from './components/PlantToJeans';


import './globals.css';


const sdmWallet = process.env.NEXT_PUBLIC_SDM_WALLET_ADDRESS || '';

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
      <main className="flex flex-1 items-center justify-center p-0 z-10 relative overflow-auto">
        <BinaryStatic />
        {/* NOISE Button */}
        <button
          className="fixed top-4 right-8 w-24 h-12 bg-black text-white flex items-center justify-center rounded-full z-40"
          onClick={handleNoiseClick}
        >
          NOISE
        </button>
        {/* VINYL Button */}
        <button
          onClick={toggleVinylOverlay}
          className="fixed top-4 left-8 w-24 h-12 bg-black text-white flex items-center justify-center rounded-full z-40"
        >
          VINYL
        </button>
        <Image
          src={'/images/6.png'}
          alt="Vinyl Icon"
          width={48}
          height={64}
          className="fixed top-20 left-20"
          priority
        />

        <Cube isAnimating={isAnimating} />
        <div className="flex flex-row items-center space-around fixed w-full -z-10">
          <WeedPlant isAnimating={isAnimating} />
          <PlantToJeans isAnimating={isAnimating} />
        </div>
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
