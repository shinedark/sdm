'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useAudio } from '@/app/context/audio-context';
export function AudioControls() {
  const {
    currentTrack,
    isPlaying,
    play,
    pause,
    favorites,
    toggleFavorite,
    download
  } = useAudio();
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync audio element with context
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    audioRef.current.src = currentTrack.url;
    if (isPlaying) audioRef.current.play();else audioRef.current.pause();
  }, [currentTrack, isPlaying]);

  // Progress bar update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => setProgress(audio.currentTime / audio.duration || 0);
    audio.addEventListener('timeupdate', update);
    return () => audio.removeEventListener('timeupdate', update);
  }, [currentTrack]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Simple audio visualizer (animated bars)
  function AudioVisualizer() {
    return <div className="flex items-end gap-0.5 h-4">
        {[...Array(8)].map((_, i) => <div key={i} className="w-1 rounded bg-blue-400 transition-all duration-300" style={{
        height: isPlaying ? `${4 + Math.sin(Date.now() / 200 + i) * 8}px` : '4px'
      }} />)}
      </div>;
  }
  if (!currentTrack) return null;
  return <div className="w-full bg-white flex flex-col items-center px-2 py-2 shadow-lg sticky bottom-0 mb-8 z-40">
      <audio ref={audioRef} hidden />
      
      <div className="flex items-center w-full max-w-xl justify-between gap-4">
        {/* Previous */}
        <button className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition" aria-label="Previous">
          ⏮
        </button>
        {/* Play/Pause */}
        <button onClick={() => isPlaying ? pause() : play(currentTrack)} className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-gray-800 transition" aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        {/* Next */}
        <button className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition" aria-label="Next">
          ⏭
        </button>
        {/* Favorite */}
        <button onClick={() => toggleFavorite(currentTrack.id)} className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center text-lg hover:bg-gray-800 transition" aria-label="Favorite">
          {favorites.has(currentTrack.id) ? '♥' : '♡'}
        </button>
        {/* Download */}
        <button onClick={() => download(currentTrack)} className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center text-lg hover:bg-gray-800 transition" aria-label="Download">
          ⇩
        </button>
        {/* Volume */}
        <div className="flex items-center gap-2">
          <span className="text-black text-lg">TURN IT UP</span>
          <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-20 accent-black" aria-label="Volume" />
        </div>
      </div>
      {/* Progress bar with audio visualizer */}
      <div className="w-full max-w-xl flex flex-col items-center mt-2">
        <input type="range" min={0} max={1} step={0.001} value={progress} onChange={e => {
        if (audioRef.current) {
          const v = Number(e.target.value);
          audioRef.current.currentTime = v * (audioRef.current.duration || 0);
          setProgress(v);
        }
      }} className="w-full accent-black" aria-label="Progress" />
      </div>
    </div>;
}