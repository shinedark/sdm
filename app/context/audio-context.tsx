// sdm/app/context/audio-context.tsx
'use client';

import React, { createContext, useContext, useState, useRef } from 'react';
interface AudioTrack {
  id: string;
  title: string;
  url: string;
  date: string;
  isFavorite: boolean;
}
interface Playlist {
  id: string;
  name: string;
  tracks: AudioTrack[];
}
interface AudioContextProps {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  play: (track: AudioTrack) => void;
  pause: () => void;
  toggleFavorite: (trackId: string) => void;
  favorites: Set<string>;
  playlists: Playlist[];
  addToPlaylist: (playlistId: string, track: AudioTrack) => void;
  createPlaylist: (name: string) => void;
  download: (track: AudioTrack) => void;
}
const AudioContext = createContext<AudioContextProps | undefined>(undefined);
export function AudioProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  function play(track: AudioTrack) {
    setCurrentTrack(track);
    setIsPlaying(true);
  }
  function pause() {
    setIsPlaying(false);
  }
  function toggleFavorite(trackId: string) {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) newSet.delete(trackId);else newSet.add(trackId);
      return newSet;
    });
  }
  function addToPlaylist(playlistId: string, track: AudioTrack) {
    setPlaylists(prev => prev.map(pl => pl.id === playlistId ? {
      ...pl,
      tracks: [...pl.tracks, track]
    } : pl));
  }
  function createPlaylist(name: string) {
    setPlaylists(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      name,
      tracks: []
    }]);
  }
  function download(track: AudioTrack) {
    // Simple download logic
    const link = document.createElement('a');
    link.href = track.url;
    link.download = `${track.title}.mp3`;
    link.click();
  }
  return <AudioContext.Provider value={{
    currentTrack,
    isPlaying,
    play,
    pause,
    toggleFavorite,
    favorites,
    playlists,
    addToPlaylist,
    createPlaylist,
    download
  }}>
      {children}
    </AudioContext.Provider>;
}
export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}