'use client';

import React, { createContext, useContext, useRef, useEffect, useState, useCallback, ReactNode } from 'react';
export interface AudioContextState {
  audioContext: AudioContext | null;
  isInitialized: boolean;
  isSuspended: boolean;
  sampleRate: number;
  currentTime: number;
  masterVolume: number;
  setMasterVolume: (volume: number) => void;
  initializeAudioContext: () => Promise<AudioContext | null>;
  resumeContext: () => Promise<void>;
  suspendContext: () => Promise<void>;
  createGainNode: () => GainNode | null;
  createOscillator: (type?: OscillatorType) => OscillatorNode | null;
  createFilter: (type?: BiquadFilterType) => BiquadFilterNode | null;
  createDelay: () => DelayNode | null;
  createReverb: () => ConvolverNode | null;
}
const AudioContextContext = createContext<AudioContextState | null>(null);
export interface AudioContextProviderProps {
  children: ReactNode;
  masterVolume?: number;
  onContextReady?: (context: AudioContext) => void;
}
export const AudioContextProvider: React.FC<AudioContextProviderProps> = ({
  children,
  masterVolume = 0.8,
  onContextReady
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentMasterVolume, setCurrentMasterVolume] = useState(masterVolume);

  // Initialize AudioContext
  const initializeAudioContext = useCallback(async () => {
    if (audioContextRef.current) return audioContextRef.current;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass({
        sampleRate: 44100,
        latencyHint: 'interactive'
      });

      // Create master gain node
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.setValueAtTime(currentMasterVolume, audioContextRef.current.currentTime);
      masterGainRef.current.connect(audioContextRef.current.destination);
      setIsInitialized(true);
      setIsSuspended(audioContextRef.current.state === 'suspended');
      onContextReady?.(audioContextRef.current);
      return audioContextRef.current;
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
      return null;
    }
  }, [currentMasterVolume, onContextReady]);

  // Resume suspended context
  const resumeContext = async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
        setIsSuspended(false);
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
      }
    }
  };

  // Suspend context
  const suspendContext = async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      try {
        await audioContextRef.current.suspend();
        setIsSuspended(true);
      } catch (error) {
        console.error('Failed to suspend AudioContext:', error);
      }
    }
  };

  // Set master volume
  const setMasterVolume = (volume: number) => {
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
      setCurrentMasterVolume(volume);
    }
  };

  // Create gain node
  const createGainNode = (): GainNode | null => {
    if (!audioContextRef.current) return null;
    const gainNode = audioContextRef.current.createGain();
    gainNode.connect(masterGainRef.current!);
    return gainNode;
  };

  // Create oscillator
  const createOscillator = (type: OscillatorType = 'sine'): OscillatorNode | null => {
    if (!audioContextRef.current) return null;
    const oscillator = audioContextRef.current.createOscillator();
    oscillator.type = type;
    return oscillator;
  };

  // Create filter
  const createFilter = (type: BiquadFilterType = 'lowpass'): BiquadFilterNode | null => {
    if (!audioContextRef.current) return null;
    const filter = audioContextRef.current.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(1000, audioContextRef.current.currentTime);
    filter.Q.setValueAtTime(1, audioContextRef.current.currentTime);
    return filter;
  };

  // Create delay
  const createDelay = (): DelayNode | null => {
    if (!audioContextRef.current) return null;
    const delay = audioContextRef.current.createDelay(1);
    delay.delayTime.setValueAtTime(0.5, audioContextRef.current.currentTime);
    return delay;
  };

  // Create reverb (simple impulse response)
  const createReverb = (): ConvolverNode | null => {
    if (!audioContextRef.current) return null;
    const convolver = audioContextRef.current.createConvolver();

    // Create a simple impulse response for reverb
    const length = audioContextRef.current.sampleRate * 2; // 2 seconds
    const impulse = audioContextRef.current.createBuffer(2, length, audioContextRef.current.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    convolver.buffer = impulse;
    return convolver;
  };

  // Update current time
  useEffect(() => {
    if (!isInitialized) return;
    const updateTime = () => {
      if (audioContextRef.current) {
        setCurrentTime(audioContextRef.current.currentTime);
      }
    };
    const interval = setInterval(updateTime, 100); // Update every 100ms
    return () => clearInterval(interval);
  }, [isInitialized]);

  // Don't initialize on mount - wait for user interaction
  // useEffect(() => {
  //   initializeAudioContext();
  // }, [initializeAudioContext]);

  // Handle user interaction to initialize or resume context
  useEffect(() => {
    const handleUserInteraction = async () => {
      if (!audioContextRef.current) {
        // Initialize AudioContext on first user interaction
        await initializeAudioContext();
      } else if (audioContextRef.current.state === 'suspended') {
        // Resume suspended context
        await resumeContext();
      }
    };

    // Add event listeners for user interaction
    const events = ['click', 'keydown', 'touchstart', 'mousedown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, {
        once: true
      });
    });
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [initializeAudioContext, resumeContext]);
  const contextValue: AudioContextState = {
    audioContext: audioContextRef.current,
    isInitialized,
    isSuspended,
    sampleRate: audioContextRef.current?.sampleRate || 44100,
    currentTime,
    masterVolume: currentMasterVolume,
    setMasterVolume,
    initializeAudioContext,
    resumeContext,
    suspendContext,
    createGainNode,
    createOscillator,
    createFilter,
    createDelay,
    createReverb
  };
  return <AudioContextContext.Provider value={contextValue}>
      {children}
    </AudioContextContext.Provider>;
};

// Hook to use AudioContext
export const useAudioContext = (): AudioContextState => {
  const context = useContext(AudioContextContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioContextProvider');
  }
  return context;
};
export default AudioContextProvider;