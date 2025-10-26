'use client';

import React, { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react';
import PizzicatoEngine, { PizzicatoSound } from './PizzicatoEngine';
export interface PizzicatoContextState {
  sounds: Map<string, PizzicatoSound>;
  isInitialized: boolean;
  createSound: (id: string, frequency: number, options?: {
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    volume?: number;
    type?: 'sine' | 'square' | 'sawtooth' | 'triangle';
  }) => PizzicatoSound | null;
  playSound: (id: string, frequency: number, velocity?: number, duration?: number) => void;
  stopSound: (id: string) => void;
  updateSound: (id: string, updates: Partial<PizzicatoSound>) => void;
  destroySound: (id: string) => void;
  getAllSounds: () => PizzicatoSound[];
  getSound: (id: string) => PizzicatoSound | undefined;
}
const PizzicatoContext = createContext<PizzicatoContextState | null>(null);
export interface PizzicatoProviderProps {
  children: ReactNode;
}
export const PizzicatoProvider: React.FC<PizzicatoProviderProps> = ({
  children
}) => {
  const [sounds, setSounds] = useState<Map<string, PizzicatoSound>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);
  const handleSoundCreate = useCallback((sound: PizzicatoSound) => {
    setSounds(prev => new Map(prev.set(sound.id, sound)));
    setIsInitialized(true);
  }, []);
  const handleSoundUpdate = useCallback((soundId: string, updates: Partial<PizzicatoSound>) => {
    setSounds(prev => {
      const newSounds = new Map(prev);
      const existingSound = newSounds.get(soundId);
      if (existingSound) {
        newSounds.set(soundId, {
          ...existingSound,
          ...updates
        });
      }
      return newSounds;
    });
  }, []);
  const handleSoundDestroy = useCallback((soundId: string) => {
    setSounds(prev => {
      const newSounds = new Map(prev);
      newSounds.delete(soundId);
      return newSounds;
    });
  }, []);
  const createSound = useCallback((id: string, frequency: number, options?: {
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    volume?: number;
    type?: 'sine' | 'square' | 'sawtooth' | 'triangle';
  }) => {
    // This will be handled by the PizzicatoEngine component
    return null;
  }, []);
  const playSound = useCallback((id: string, frequency: number, velocity: number = 1, duration: number = 1) => {
    // This will be handled by the PizzicatoEngine component
  }, []);
  const stopSound = useCallback((id: string) => {
    // This will be handled by the PizzicatoEngine component
  }, []);
  const updateSound = useCallback((id: string, updates: Partial<PizzicatoSound>) => {
    // This will be handled by the PizzicatoEngine component
  }, []);
  const destroySound = useCallback((id: string) => {
    // This will be handled by the PizzicatoEngine component
  }, []);
  const getAllSounds = useCallback(() => {
    return Array.from(sounds.values());
  }, [sounds]);
  const getSound = useCallback((id: string) => {
    return sounds.get(id);
  }, [sounds]);
  const contextValue: PizzicatoContextState = {
    sounds,
    isInitialized,
    createSound,
    playSound,
    stopSound,
    updateSound,
    destroySound,
    getAllSounds,
    getSound
  };
  return <PizzicatoContext.Provider value={contextValue}>
      <PizzicatoEngine onSoundCreate={handleSoundCreate} onSoundUpdate={handleSoundUpdate} onSoundDestroy={handleSoundDestroy} />
      {children}
    </PizzicatoContext.Provider>;
};
export const usePizzicato = (): PizzicatoContextState => {
  const context = useContext(PizzicatoContext);
  if (!context) {
    throw new Error('usePizzicato must be used within a PizzicatoProvider');
  }
  return context;
};