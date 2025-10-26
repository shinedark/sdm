'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

// Tone.js types and initialization
declare global {
  interface Window {
    Tone: any;
  }
}

// Dynamic Tone.js loading
const loadTone = async () => {
  if (typeof window !== 'undefined' && !window.Tone) {
    try {
      // Load Tone.js from CDN or local file
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/tone@latest/build/Tone.js';
      script.async = true;
      document.head.appendChild(script);
      return new Promise((resolve, reject) => {
        script.onload = () => resolve(window.Tone);
        script.onerror = reject;
      });
    } catch (error) {
      console.error('Failed to load Tone.js:', error);
      return null;
    }
  }
  return window.Tone;
};
export interface ToneInstrument {
  id: string;
  instrument: any;
  isPlaying: boolean;
  frequency: number;
  volume: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}
export interface ToneEngineProps {
  onInstrumentCreate?: (instrument: ToneInstrument) => void;
  onInstrumentUpdate?: (instrumentId: string, updates: Partial<ToneInstrument>) => void;
  onInstrumentDestroy?: (instrumentId: string) => void;
}
const ToneEngine: React.FC<ToneEngineProps> = ({
  onInstrumentCreate,
  onInstrumentUpdate,
  onInstrumentDestroy
}) => {
  const instrumentsRef = useRef<Map<string, ToneInstrument>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // Initialize Tone.js
  useEffect(() => {
    const initializeTone = async () => {
      try {
        const Tone = await loadTone();
        if (Tone) {
          setIsInitialized(true);
          console.log('Tone.js loaded successfully');
        }
      } catch (error) {
        console.error('Failed to initialize Tone.js:', error);
      }
    };
    initializeTone();
  }, []);

  // Start Tone.js context
  const startTone = useCallback(async () => {
    if (!isInitialized || !window.Tone) return;
    try {
      await window.Tone.start();
      setIsStarted(true);
      console.log('Tone.js started successfully');
    } catch (error) {
      console.error('Failed to start Tone.js:', error);
    }
  }, [isInitialized]);

  // Create a new instrument
  const createInstrument = useCallback((id: string, options: {
    type?: 'synth' | 'fmsynth' | 'amsynth' | 'duosynth' | 'monosynth';
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    volume?: number;
  } = {}) => {
    if (!isInitialized || !window.Tone) return null;
    const {
      type = 'synth',
      attack = 0.1,
      decay = 0.2,
      sustain = 0.5,
      release = 0.8,
      volume = 0.5
    } = options;
    try {
      let instrument;
      switch (type) {
        case 'fmsynth':
          instrument = new window.Tone.FMSynth({
            harmonicity: 3,
            modulationIndex: 10,
            oscillator: {
              type: 'sine'
            },
            envelope: {
              attack: attack,
              decay: decay,
              sustain: sustain,
              release: release
            }
          });
          break;
        case 'amsynth':
          instrument = new window.Tone.AMSynth({
            harmonicity: 3,
            oscillator: {
              type: 'sine'
            },
            envelope: {
              attack: attack,
              decay: decay,
              sustain: sustain,
              release: release
            }
          });
          break;
        case 'duosynth':
          instrument = new window.Tone.DuoSynth({
            vibratoAmount: 0.5,
            vibratoRate: 5,
            harmonicity: 1.5,
            voice0: {
              oscillator: {
                type: 'sine'
              },
              envelope: {
                attack: attack,
                decay: decay,
                sustain: sustain,
                release: release
              }
            },
            voice1: {
              oscillator: {
                type: 'sine'
              },
              envelope: {
                attack: attack,
                decay: decay,
                sustain: sustain,
                release: release
              }
            }
          });
          break;
        case 'monosynth':
          instrument = new window.Tone.MonoSynth({
            oscillator: {
              type: 'sawtooth'
            },
            filter: {
              Q: 1,
              type: 'lowpass',
              rolloff: -24
            },
            envelope: {
              attack: attack,
              decay: decay,
              sustain: sustain,
              release: release
            }
          });
          break;
        default:
          instrument = new window.Tone.Synth({
            oscillator: {
              type: 'sine'
            },
            envelope: {
              attack: attack,
              decay: decay,
              sustain: sustain,
              release: release
            }
          });
      }

      // Set volume
      instrument.volume.value = window.Tone.gainToDb(volume);
      const toneInstrument: ToneInstrument = {
        id,
        instrument,
        isPlaying: false,
        frequency: 440,
        volume,
        attack,
        decay,
        sustain,
        release
      };
      instrumentsRef.current.set(id, toneInstrument);
      onInstrumentCreate?.(toneInstrument);
      return toneInstrument;
    } catch (error) {
      console.error('Failed to create Tone.js instrument:', error);
      return null;
    }
  }, [isInitialized, onInstrumentCreate]);

  // Play a note
  const playNote = useCallback((instrumentId: string, frequency: string | number, duration: string | number = '8n', velocity: number = 1) => {
    const instrumentData = instrumentsRef.current.get(instrumentId);
    if (!instrumentData || !isStarted) return;
    try {
      // Trigger the note
      instrumentData.instrument.triggerAttackRelease(frequency, duration, window.Tone.now(), velocity);

      // Update state
      instrumentData.isPlaying = true;
      instrumentData.frequency = typeof frequency === 'string' ? window.Tone.Frequency(frequency).toFrequency() : frequency;
      instrumentData.volume = velocity;
      onInstrumentUpdate?.(instrumentId, {
        isPlaying: true,
        frequency: instrumentData.frequency,
        volume: velocity
      });

      // Reset playing state after note duration
      const noteDuration = window.Tone.Time(duration).toSeconds() * 1000;
      setTimeout(() => {
        instrumentData.isPlaying = false;
        onInstrumentUpdate?.(instrumentId, {
          isPlaying: false,
          volume: 0
        });
      }, noteDuration);
    } catch (error) {
      console.error('Failed to play Tone.js note:', error);
    }
  }, [isStarted, onInstrumentUpdate]);

  // Stop all notes
  const stopAll = useCallback(() => {
    if (!isStarted) return;
    try {
      window.Tone.Transport.stop();
      window.Tone.Transport.cancel();

      // Stop all instruments
      instrumentsRef.current.forEach(instrumentData => {
        instrumentData.instrument.releaseAll();
        instrumentData.isPlaying = false;
        onInstrumentUpdate?.(instrumentData.id, {
          isPlaying: false,
          volume: 0
        });
      });
    } catch (error) {
      console.error('Failed to stop Tone.js:', error);
    }
  }, [isStarted, onInstrumentUpdate]);

  // Update instrument parameters
  const updateInstrument = useCallback((instrumentId: string, updates: Partial<ToneInstrument>) => {
    const instrumentData = instrumentsRef.current.get(instrumentId);
    if (!instrumentData) return;
    try {
      if (updates.volume !== undefined) {
        instrumentData.instrument.volume.value = window.Tone.gainToDb(updates.volume);
        instrumentData.volume = updates.volume;
      }
      if (updates.attack !== undefined || updates.decay !== undefined || updates.sustain !== undefined || updates.release !== undefined) {
        const envelope = instrumentData.instrument.envelope;
        if (envelope) {
          if (updates.attack !== undefined) envelope.attack = updates.attack;
          if (updates.decay !== undefined) envelope.decay = updates.decay;
          if (updates.sustain !== undefined) envelope.sustain = updates.sustain;
          if (updates.release !== undefined) envelope.release = updates.release;
        }
      }
      onInstrumentUpdate?.(instrumentId, updates);
    } catch (error) {
      console.error('Failed to update Tone.js instrument:', error);
    }
  }, [onInstrumentUpdate]);

  // Get all instruments
  const getAllInstruments = useCallback(() => {
    return Array.from(instrumentsRef.current.values());
  }, []);

  // Get a specific instrument
  const getInstrument = useCallback((id: string) => {
    return instrumentsRef.current.get(id);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isStarted && window.Tone) {
        try {
          window.Tone.Transport.stop();
          window.Tone.Transport.cancel();
          instrumentsRef.current.forEach(instrumentData => {
            instrumentData.instrument.dispose();
          });
          instrumentsRef.current.clear();
        } catch (error) {
          console.error('Error during Tone.js cleanup:', error);
        }
      }
    };
  }, [isStarted]);

  // Expose methods through ref
  const engineRef = useRef({
    createInstrument,
    playNote,
    stopAll,
    updateInstrument,
    getAllInstruments,
    getInstrument,
    startTone,
    isInitialized,
    isStarted
  });
  return null; // This is a headless component
};
export default ToneEngine;