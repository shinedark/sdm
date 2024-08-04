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

  useEffect(() => {
    const handleAudioPlay = () => setIsAnimating(true);
    const handleAudioPause = () => setIsAnimating(false);

    if (audioRef.current) {
      audioRef.current.addEventListener('play', handleAudioPlay);
      audioRef.current.addEventListener('pause', handleAudioPause);
      audioRef.current.addEventListener('ended', handleAudioPause); // Stop animation when audio ends
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handleAudioPlay);
        audioRef.current.removeEventListener('pause', handleAudioPause);
        audioRef.current.removeEventListener('ended', handleAudioPause);
      }
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-0">
                    <BinaryStatic />
      {/* NOISE Button outside the main container */}
      <button
        className="fixed top-4 right-4 w-24 h-12 bg-black text-white flex items-center justify-center rounded-full z-10"
        onClick={handleNoiseClick}
      >
        NOISE
      </button>
        <Cube isAnimating={isAnimating} />
      {/* Audio Element */}
      <audio ref={audioRef} src="/music/elritmo.m4a" preload="auto" />
    </main>
  );
}
