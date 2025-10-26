'use client';

import React, { useState, useEffect } from 'react';
import StepSequencer from '../components/audio/StepSequencer';
import { MIDIPattern } from '../components/audio/MIDISequencer';
export default function AudioPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [globalTempo, setGlobalTempo] = useState(120);
  const [mutedPatterns, setMutedPatterns] = useState<Set<string>>(new Set());

  // Tempo presets
  const TEMPO_PRESETS = {
    low: 60,
    mid: 120,
    high: 240
  };

  // Master tempo - all patterns will be normalized to this
  const MASTER_TEMPO = globalTempo;
  const MASTER_BARS = 16; // 16-bar loop
  const BEATS_PER_BAR = 4;
  const TOTAL_BEATS = MASTER_BARS * BEATS_PER_BAR; // 64 beats total

  // Helper function to normalize patterns to master tempo and 16-bar loop
  const normalizePattern = (pattern: any, originalTempo: number, originalBars: number) => {
    const tempoRatio = originalTempo / MASTER_TEMPO;
    const barRatio = MASTER_BARS / originalBars;
    
    return {
      ...pattern,
      tempo: MASTER_TEMPO,
      length: TOTAL_BEATS,
      notes: pattern.notes.map((note: any) => ({
        ...note,
        startTime: (note.startTime * tempoRatio * barRatio) % TOTAL_BEATS,
        duration: note.duration * tempoRatio * barRatio
      }))
    };
  };

  // Load real MIDI patterns from generated file
  const [realPatterns, setRealPatterns] = useState<MIDIPattern[]>([]);
  
  // Load patterns on component mount
  useEffect(() => {
    const loadPatterns = async () => {
      try {
        const response = await fetch('/midi_patterns.json');
        const patterns = await response.json();
        
        // Take first 8 patterns and normalize them
        const normalizedPatterns = patterns.slice(0, 8).map((pattern: any, index: number) => ({
          ...pattern,
          id: `real-pattern-${index + 1}`,
          name: pattern.name || `Pattern ${index + 1}`,
          tempo: globalTempo, // Use current global tempo
          timeSignature: [4, 4],
          length: 64, // 16 bars * 4 beats
          loop: true
        }));
        
        setRealPatterns(normalizedPatterns);
        console.log('🎵 Loaded real MIDI patterns:', normalizedPatterns.length);
      } catch (error) {
        console.error('❌ Failed to load real MIDI patterns:', error);
        // Fallback to default patterns
        setRealPatterns([]);
      }
    };
    
    loadPatterns();
  }, [globalTempo]);

  // Use real patterns if available, otherwise fallback to default
  const midiPatterns: MIDIPattern[] = realPatterns.length > 0 ? realPatterns : [
    // Fallback patterns if real ones fail to load
    {
      id: 'fallback-1',
      name: 'Kick Drum',
      tempo: globalTempo,
      timeSignature: [4, 4],
      length: 64,
      loop: true,
      notes: [
        { note: 36, velocity: 127, startTime: 0, duration: 0.5, channel: 9 },
        { note: 36, velocity: 100, startTime: 2, duration: 0.5, channel: 9 },
        { note: 36, velocity: 127, startTime: 4, duration: 0.5, channel: 9 },
        { note: 36, velocity: 100, startTime: 6, duration: 0.5, channel: 9 }
      ]
    },
    {
      id: 'fallback-2',
      name: 'Snare Drum',
      tempo: globalTempo,
      timeSignature: [4, 4],
      length: 64,
      loop: true,
      notes: [
        { note: 38, velocity: 100, startTime: 1, duration: 0.5, channel: 9 },
        { note: 38, velocity: 100, startTime: 3, duration: 0.5, channel: 9 },
        { note: 38, velocity: 100, startTime: 5, duration: 0.5, channel: 9 },
        { note: 38, velocity: 100, startTime: 7, duration: 0.5, channel: 9 }
      ]
    }
  ];
  const handlePatternSelect = (patternId: string) => {
    console.log('Pattern selected:', patternId);
    // Toggle mute state
    setMutedPatterns(prev => {
      const newMuted = new Set(prev);
      if (newMuted.has(patternId)) {
        newMuted.delete(patternId);
        console.log(`🔊 Unmuted pattern: ${patternId}`);
      } else {
        newMuted.add(patternId);
        console.log(`🔇 Muted pattern: ${patternId}`);
      }
      return newMuted;
    });
  };
  
  const handleStepToggle = (patternId: string, step: number, note: any) => {
    console.log('Step toggled:', patternId, step, note);
  };
  
  const handlePlay = () => {
    setIsPlaying(true);
    console.log('Play started at tempo:', globalTempo);
  };
  
  const handleStop = () => {
    setIsPlaying(false);
    console.log('Play stopped');
  };
  
  const handleVolumeChange = (volume: number) => {
    console.log('Volume changed:', volume);
  };

  const handleTempoChange = (tempo: number) => {
    setGlobalTempo(tempo);
    console.log('Tempo changed to:', tempo);
  };
  return <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        {/* Tempo Controls */}
        <div className="mb-6 bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Global Tempo</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => handleTempoChange(TEMPO_PRESETS.low)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                globalTempo === TEMPO_PRESETS.low
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Low ({TEMPO_PRESETS.low} BPM)
            </button>
            <button
              onClick={() => handleTempoChange(TEMPO_PRESETS.mid)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                globalTempo === TEMPO_PRESETS.mid
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Mid ({TEMPO_PRESETS.mid} BPM)
            </button>
            <button
              onClick={() => handleTempoChange(TEMPO_PRESETS.high)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                globalTempo === TEMPO_PRESETS.high
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              High ({TEMPO_PRESETS.high} BPM)
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            Current: {globalTempo} BPM | Loop Duration: {((MASTER_BARS * BEATS_PER_BAR * 60) / globalTempo).toFixed(1)}s
          </div>
        </div>
        
        <StepSequencer 
          patterns={midiPatterns} 
          isPlaying={isPlaying} 
          currentBeat={currentBeat} 
          onPatternSelect={handlePatternSelect} 
          onStepToggle={handleStepToggle} 
          onPlay={handlePlay} 
          onStop={handleStop} 
          onVolumeChange={handleVolumeChange} 
          stepsPerPattern={16} 
          maxSlots={8} 
          className="w-full"
          globalTempo={globalTempo}
          mutedPatterns={mutedPatterns}
        />
      </div>
    </div>;
}