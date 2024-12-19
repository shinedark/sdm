'use client';
import React, { useState, useRef, Suspense } from 'react';
import Cube from './components/Cube';
import Image from 'next/image';
import BinaryStatic from './components/BinaryStatic';
import Footer from './components/Footer';
import Vinyl from './components/Vinyl';
import GlobeGallery from './components/GlobeGallery';

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
      <GlobeGallery />
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

        <Image
          src="/images/6.png"
          alt="Vinyl Icon"
          width={48}
          height={64}
          className="mt-2 absolute top-10 left-10"
          priority
        />

        <Cube isAnimating={isAnimating} />

        {/* Audio Element */}
        <audio ref={audioRef} src="/music/elritmo.m4a" preload="auto" />
      </main>

      {/* Remove or comment out the existing GlobeGallery div */}
      {/* <div className='flex flex-1 items-center justify-center mt-8'>
        <GlobeGallery />
      </div> */}

      <div className="flex flex-1 items-center justify-center p-0 z-10">
        <h1 className='font-bold text-black text-2xl'>
          <a className='contact' href="mailto:shinedarkmusic@gmail.com">CONTACT US</a>
        </h1>
      </div>
      <Footer />

      {/* Vinyl Overlay */}
      {showVinyl && (
        <Vinyl onClose={closeVinylOverlay} />
      )}
    </div>
  );
}
