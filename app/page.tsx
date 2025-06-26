'use client';
import React, { useState, useRef, Suspense } from 'react';
import Cube from './components/Cube';
import Image from 'next/image';
import BinaryStatic from './components/BinaryStatic';
import Footer from './components/Footer';
import Vinyl from './components/Vinyl';
import WeedPlant from './components/WeedPlant';
import PlantToJeans from './components/PlantToJeans';
import Navigation from './components/Navigation';
import ElArchivo from './components/sections/ElArchivo';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import { ExpandableCard } from './components/ExpandableCard';
import FoodList from './components/FoodList';
import { AudioControls } from './components/audio-controls/audio-controls';

import './globals.css';

const sdmWallet = process.env.NEXT_PUBLIC_SDM_WALLET_ADDRESS || '';

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVinyl, setShowVinyl] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const elementRef = useRef(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showMedicalId, setShowMedicalId] = useState(false);
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

  const toggleMedicalId = () => {
    setShowMedicalId(!showMedicalId);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Home':
        return (
          <div className="mb-20 mt-20 w-full">
            <BinaryStatic />
            <button
              className="editz fixed top-4 right-8 w-24 h-12   flex items-center justify-center border-black border-2 rounded-full z-40"
              onClick={handleNoiseClick}
            >
              {`NOISE`}
            </button>
            <button
              onClick={toggleVinylOverlay}
              className="fixed top-4 left-8 w-24 h-12 bg-black text-white flex items-center justify-center rounded-full z-40"
            >
              {`VINYL`}
            </button>
            <Image
              src={'/images/6.png'}
              alt="Medical ID"
              width={48}
              height={64}
              className="fixed top-20 left-20"
              priority
            />
            <button
              className="fixed top-50 right-3 bg-gray-900 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-colors duration-300 z-50"
              onClick={toggleMedicalId}
            >
              Medical ID
            </button>
            {showMedicalId && (
              <ExpandableCard
                imageUrl="/images/6.png"
                imageAlt="Description of the image"
                rightContent={
                  <div>
                    <h2 className="text-2xl text-black font-bold mb-4">{`Title`}</h2>
                    <p className="text-black">{`Your content here`}</p>
                  </div>
                }
                bottomContent={<FoodList />}
              />
            )}
            <Cube 
              isAnimating={isAnimating} 
              ref={elementRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)} 
              isHovered={isHovered} 
            />
            <div className="flex flex-row items-center space-around fixed w-full -z-10">
              <WeedPlant isAnimating={isAnimating} />
              <PlantToJeans isAnimating={isAnimating} />
            </div>
            <audio ref={audioRef} src="/music/elritmo.m4a" preload="auto" />
          </div>
        );
      case 'EL ARCHIVO':
        return <ElArchivo />;
      case 'About':
        return <About />;
      case 'Projects':
        return <Projects />;
      default:
        return null;
    }
  };

  return (
    <div className=" flex flex-col min-h-screen relative z-0">
      <Navigation  activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className=" flex flex-1 items-center justify-center p-0 z-10 relative overflow-auto">
        {renderSection()}
      </main>
      <div className="w-full bg-white border-t flex flex-col items-center px-2 py-2 shadow-lg sticky bottom-0 z-40">
        <AudioControls />
      </div>
      <Footer />
      {showVinyl && <Vinyl onClose={closeVinylOverlay} />}
    </div>
  );
}
