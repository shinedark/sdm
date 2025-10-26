'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
export interface OscillatorConfig {
  type: OscillatorType;
  frequency: number;
  detune: number;
  volume: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}
export interface OscillatorNodeProps {
  config: OscillatorConfig;
  isPlaying: boolean;
  onFrequencyChange?: (frequency: number) => void;
  onVolumeChange?: (volume: number) => void;
  className?: string;
}
const OscillatorNode: React.FC<OscillatorNodeProps> = ({
  config,
  isPlaying,
  onFrequencyChange,
  onVolumeChange,
  className = ''
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize AudioContext
  const initializeAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Resume context if suspended (required for user interaction)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      setIsInitialized(true);
    }
  }, []);

  // Create oscillator and gain nodes
  const createOscillator = useCallback(() => {
    if (!audioContextRef.current) return;

    // Clean up existing oscillator
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }

    // Create new oscillator
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    // Configure oscillator
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, audioContextRef.current.currentTime);
    oscillator.detune.setValueAtTime(config.detune, audioContextRef.current.currentTime);

    // Configure gain (ADSR envelope)
    const now = audioContextRef.current.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    if (isPlaying) {
      // Attack
      gainNode.gain.linearRampToValueAtTime(config.volume, now + config.attack);
      // Decay
      gainNode.gain.linearRampToValueAtTime(config.volume * config.sustain, now + config.attack + config.decay);
    }

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    return {
      oscillator,
      gainNode
    };
  }, [config, isPlaying]);

  // Start/stop oscillator
  useEffect(() => {
    if (!isInitialized) return;
    if (isPlaying) {
      const {
        oscillator
      } = createOscillator() || {};
      if (oscillator) {
        oscillator.start();
      }
    } else {
      if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
        const now = audioContextRef.current.currentTime;
        // Release phase
        gainNodeRef.current.gain.linearRampToValueAtTime(0, now + config.release);

        // Stop oscillator after release
        setTimeout(() => {
          if (oscillatorRef.current) {
            oscillatorRef.current.stop();
          }
        }, config.release * 1000);
      }
    }
  }, [isPlaying, isInitialized, createOscillator, config.release]);

  // Update frequency
  useEffect(() => {
    if (oscillatorRef.current && audioContextRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(config.frequency, audioContextRef.current.currentTime);
    }
  }, [config.frequency]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      gainNodeRef.current.gain.setValueAtTime(config.volume, now);
    }
  }, [config.volume]);

  // Initialize on mount
  useEffect(() => {
    initializeAudioContext();
  }, [initializeAudioContext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
    };
  }, []);
  const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const frequency = parseFloat(event.target.value);
    onFrequencyChange?.(frequency);
  };
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value);
    onVolumeChange?.(volume);
  };
  return <div className={`oscillator-node p-4 border rounded-lg bg-gray-900 text-white ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Oscillator</h3>
      
      <div className="space-y-4">
        {/* Waveform Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Waveform</label>
          <select value={config.type} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" onChange={e => {
          // This would need to be handled by parent component
        }}>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>

        {/* Frequency Control */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Frequency: {config.frequency.toFixed(1)} Hz
          </label>
          <input type="range" min="20" max="20000" step="1" value={config.frequency} onChange={handleFrequencyChange} className="w-full" />
        </div>

        {/* Detune Control */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Detune: {config.detune} cents
          </label>
          <input type="range" min="-1200" max="1200" step="1" value={config.detune} className="w-full" />
        </div>

        {/* Volume Control */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Volume: {(config.volume * 100).toFixed(0)}%
          </label>
          <input type="range" min="0" max="1" step="0.01" value={config.volume} onChange={handleVolumeChange} className="w-full" />
        </div>

        {/* ADSR Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Attack</label>
            <input type="range" min="0" max="2" step="0.01" value={config.attack} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Decay</label>
            <input type="range" min="0" max="2" step="0.01" value={config.decay} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sustain</label>
            <input type="range" min="0" max="1" step="0.01" value={config.sustain} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Release</label>
            <input type="range" min="0" max="2" step="0.01" value={config.release} className="w-full" />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">
            {isPlaying ? 'Playing' : 'Stopped'} | 
            {isInitialized ? ' Ready' : ' Initializing...'}
          </span>
        </div>
      </div>
    </div>;
};
export default OscillatorNode;