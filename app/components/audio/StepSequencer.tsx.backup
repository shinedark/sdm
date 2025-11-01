'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MIDIPattern } from './MIDISequencer';

interface StepSequencerProps {
  patterns: MIDIPattern[];
  isPlaying: boolean;
  currentBeat: number;
  onPatternSelect: (patternId: string) => void;
  onStepToggle: (patternId: string, step: number, note: any) => void;
  onPlay: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
  stepsPerPattern?: number;
  maxSlots?: number;
  className?: string;
  globalTempo?: number;
  mutedPatterns?: Set<string>;
}

const StepSequencer: React.FC<StepSequencerProps> = ({
  patterns,
  isPlaying,
  currentBeat,
  onPatternSelect,
  onPlay,
  onStop,
  onVolumeChange,
  stepsPerPattern = 16,
  maxSlots = 8,
  className = '',
  globalTempo = 120,
  mutedPatterns = new Set()
}) => {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const scheduledNotesRef = useRef<Map<string, OscillatorNode>>(new Map());
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Calculate pattern duration in seconds based on tempo
  const getPatternDuration = (pattern: MIDIPattern) => {
    const beatsPerSecond = globalTempo / 60;
    return pattern.length / beatsPerSecond;
  };

  // Calculate pattern width as percentage of timeline
  const getPatternWidth = (pattern: MIDIPattern) => {
    // All patterns are now 16 bars = 32 seconds at 120 BPM
    return 100; // Full width for all patterns
  };

  // Calculate pattern position based on start time
  const getPatternPosition = (pattern: MIDIPattern, index: number) => {
    // All patterns start at the beginning (0%)
    return 0;
  };

  // Initialize audio context
  const initAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = volume;
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  }, [volume]);

  // Convert MIDI note number to frequency
  const midiToFrequency = (midiNote: number): number => {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  };

  // Error monitoring function
  const logError = useCallback(async (error: Error, context: string) => {
    try {
      await fetch('http://localhost:3002/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name
          },
          context,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.log('Failed to log error to monitoring server:', e);
    }
  }, []);

  // Play a single note
  const playNote = useCallback((note: any, startTime: number, duration: number) => {
    if (!audioContextRef.current || !gainNodeRef.current) {
      console.log('❌ Audio context or gain node not available');
      return;
    }

    const currentTime = audioContextRef.current.currentTime;
    
    // Don't schedule notes in the past
    if (startTime < currentTime) {
      console.log('⏰ Skipping note in the past:', {
        startTime: startTime,
        currentTime: currentTime,
        difference: startTime - currentTime
      });
      return;
    }

    console.log('🎵 Playing note:', {
      midiNote: note.note,
      frequency: midiToFrequency(note.note),
      velocity: note.velocity,
      channel: note.channel,
      startTime: startTime,
      duration: duration,
      currentTime: currentTime,
      timeUntilPlay: startTime - currentTime
    });

    const oscillator = audioContextRef.current.createOscillator();
    const noteGain = audioContextRef.current.createGain();
    
    // Set up oscillator
    oscillator.frequency.value = midiToFrequency(note.note);
    oscillator.type = note.channel === 9 ? 'square' : 'sine'; // Drums use square wave
    
    // Set up gain with ADSR envelope
    const velocity = note.velocity / 127;
    const attackTime = 0.01;
    const decayTime = 0.1;
    const sustainLevel = 0.7;
    const releaseTime = 0.2;
    
    let safeStartTime: number;
    let safeEndTime: number;
    
    try {
      // Ensure all times are in the future
      safeStartTime = Math.max(startTime, currentTime + 0.01);
      const safeAttackTime = safeStartTime + attackTime;
      const safeDecayTime = safeAttackTime + decayTime;
      const safeReleaseTime = Math.max(safeStartTime + duration - releaseTime, safeDecayTime);
      safeEndTime = safeStartTime + duration;
      
      // Validate all times are finite and positive
      if (!isFinite(safeStartTime) || safeStartTime < 0) {
        throw new Error(`Invalid start time: ${safeStartTime}`);
      }
      if (!isFinite(safeEndTime) || safeEndTime <= safeStartTime) {
        throw new Error(`Invalid end time: ${safeEndTime}`);
      }
      
      noteGain.gain.setValueAtTime(0, safeStartTime);
      noteGain.gain.linearRampToValueAtTime(velocity * sustainLevel, safeAttackTime);
      noteGain.gain.linearRampToValueAtTime(velocity * sustainLevel * 0.8, safeDecayTime);
      noteGain.gain.setValueAtTime(velocity * sustainLevel * 0.8, safeReleaseTime);
      noteGain.gain.linearRampToValueAtTime(0, safeEndTime);
      
      // Connect nodes
      oscillator.connect(noteGain);
      noteGain.connect(gainNodeRef.current);
      
      console.log('🔌 Audio chain connected: Oscillator → NoteGain → MasterGain → Destination');
      console.log('🎛️ Master gain value:', gainNodeRef.current.gain.value);
      
      // Start and stop oscillator
      oscillator.start(safeStartTime);
      oscillator.stop(safeEndTime);
      
    } catch (error) {
      console.error('❌ Audio scheduling error:', error);
      logError(error as Error, `playNote - note: ${note.note}, startTime: ${startTime}, duration: ${duration}`);
      return;
    }
    
    // Store reference for cleanup
    const noteId = `${note.note}-${safeStartTime}`;
    scheduledNotesRef.current.set(noteId, oscillator);
    
    // Clean up after note ends
    const cleanupDelay = Math.max((safeEndTime - currentTime) * 1000 + 100, 100);
    setTimeout(() => {
      scheduledNotesRef.current.delete(noteId);
    }, cleanupDelay);
  }, []);

  // Schedule pattern playback
  const schedulePattern = useCallback((pattern: MIDIPattern, startTime: number) => {
    if (!audioContextRef.current) {
      console.log('❌ Audio context not available for pattern scheduling');
      return;
    }

    // Check if pattern is muted
    if (mutedPatterns.has(pattern.id)) {
      console.log(`🔇 Pattern ${pattern.name} is muted, skipping`);
      return;
    }

    console.log('🎼 Scheduling pattern:', {
      name: pattern.name,
      tempo: globalTempo,
      notesCount: pattern.notes.length,
      startTime: startTime,
      currentTime: audioContextRef.current.currentTime,
      muted: mutedPatterns.has(pattern.id)
    });

    pattern.notes.forEach((note, index) => {
      const noteStartTime = startTime + (note.startTime * 60 / globalTempo);
      const noteDuration = note.duration * 60 / globalTempo;
      
      console.log(`🎵 Note ${index + 1}/${pattern.notes.length}:`, {
        midiNote: note.note,
        startTime: note.startTime,
        duration: note.duration,
        calculatedStartTime: noteStartTime,
        calculatedDuration: noteDuration,
        timeUntilPlay: audioContextRef.current ? noteStartTime - audioContextRef.current.currentTime : 0
      });
      
      playNote(note, noteStartTime, noteDuration);
    });
  }, [playNote, globalTempo, mutedPatterns]);

  // Update playhead position and schedule notes
  const updatePlayhead = useCallback(() => {
    if (!isPlaying || !audioContextRef.current) return;

    const currentTime = audioContextRef.current.currentTime;
    const elapsed = currentTime - startTimeRef.current;
    
    // Calculate 16-bar loop duration based on current tempo
    // 16 bars * 4 beats/bar * 60 seconds/minute / tempo beats/minute
    const loopDuration = (16 * 4 * 60) / globalTempo;
    const progress = (elapsed % loopDuration) / loopDuration;
    setPlayheadPosition(progress * 100);

    console.log('⏱️ Playhead update:', {
      currentTime: currentTime.toFixed(3),
      elapsed: elapsed.toFixed(3),
      progress: (progress * 100).toFixed(1) + '%',
      patternsCount: patterns.length,
      loopDuration: loopDuration
    });

    // Schedule notes for the next 0.1 seconds
    patterns.forEach((pattern, index) => {
      // All patterns now play simultaneously, not staggered
      const patternStart = 0; // All patterns start at the same time
      const nextPatternStart = patternStart + Math.floor(elapsed / loopDuration) * loopDuration;
      
      console.log(`🎼 Pattern ${index + 1} (${pattern.name}):`, {
        patternLength: pattern.length,
        patternStart: patternStart.toFixed(2),
        nextPatternStart: nextPatternStart.toFixed(2),
        shouldSchedule: nextPatternStart <= currentTime + 0.1 && nextPatternStart > currentTime - 0.1
      });
      
      if (nextPatternStart <= currentTime + 0.1 && nextPatternStart > currentTime - 0.1) {
        console.log(`✅ Scheduling pattern: ${pattern.name}`);
        schedulePattern(pattern, nextPatternStart);
      }
    });

    animationFrameRef.current = requestAnimationFrame(updatePlayhead);
  }, [isPlaying, patterns, schedulePattern, globalTempo]);

  // Update playhead position
  useEffect(() => {
    if (isPlaying) {
      updatePlayhead();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updatePlayhead]);

  const handlePatternClick = (patternId: string) => {
    setSelectedPattern(patternId);
    onPatternSelect(patternId);
  };

  const handlePlay = async () => {
    console.log('🎮 Play button clicked');
    await initAudioContext();
    
    if (audioContextRef.current) {
      startTimeRef.current = audioContextRef.current.currentTime;
      console.log('🎵 Audio context initialized:', {
        state: audioContextRef.current.state,
        currentTime: audioContextRef.current.currentTime,
        sampleRate: audioContextRef.current.sampleRate,
        masterGain: gainNodeRef.current?.gain.value
      });
      
      // Test immediate sound
      const testOscillator = audioContextRef.current.createOscillator();
      const testGain = audioContextRef.current.createGain();
      testOscillator.frequency.value = 440; // A4
      testOscillator.type = 'sine';
      testGain.gain.value = 0.1;
      testOscillator.connect(testGain);
      testGain.connect(audioContextRef.current.destination);
      testOscillator.start();
      testOscillator.stop(audioContextRef.current.currentTime + 0.1);
      console.log('🔊 Test sound played');
    }
    
    onPlay();
  };

  const handleStop = () => {
    // Stop all scheduled notes
    scheduledNotesRef.current.forEach(oscillator => {
      try {
        oscillator.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    scheduledNotesRef.current.clear();
    
    onStop();
    setPlayheadPosition(0);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
    onVolumeChange(newVolume);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      scheduledNotesRef.current.forEach(oscillator => {
        try {
          oscillator.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      scheduledNotesRef.current.clear();
    };
  }, []);

  return (
    <div className={`bg-gray-900 text-white p-6 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Step Sequencer</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={isPlaying ? handleStop : handlePlay}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              isPlaying 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isPlaying ? 'Stop' : 'Play'}
          </button>
          <button
            onClick={async () => {
              await initAudioContext();
              if (audioContextRef.current) {
                const testOscillator = audioContextRef.current.createOscillator();
                const testGain = audioContextRef.current.createGain();
                testOscillator.frequency.value = 440;
                testOscillator.type = 'sine';
                testGain.gain.value = 0.2;
                testOscillator.connect(testGain);
                testGain.connect(audioContextRef.current.destination);
                testOscillator.start();
                testOscillator.stop(audioContextRef.current.currentTime + 0.5);
                console.log('🔊 Test sound triggered');
              }
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Test Sound
          </button>
          <div className="flex items-center space-x-2">
            <label className="text-sm">Volume:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20"
            />
            <span className="text-sm w-8">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>0s</span>
          <span>{((16 * 4 * 60) / globalTempo / 4).toFixed(1)}s</span>
          <span>{((16 * 4 * 60) / globalTempo / 2).toFixed(1)}s</span>
          <span>{((16 * 4 * 60) / globalTempo * 3 / 4).toFixed(1)}s</span>
          <span>{((16 * 4 * 60) / globalTempo).toFixed(1)}s</span>
        </div>
        <div 
          ref={timelineRef}
          className="relative h-2 bg-gray-700 rounded-full overflow-hidden"
        >
          {/* Playhead */}
          <div
            className="absolute top-0 h-full w-0.5 bg-green-500 transition-all duration-100"
            style={{ left: `${playheadPosition}%` }}
          />
          {/* Bar markers */}
          {Array.from({ length: 17 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full w-px bg-gray-500"
              style={{ left: `${(i / 16) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Bar 1</span>
          <span>Bar 4</span>
          <span>Bar 8</span>
          <span>Bar 12</span>
          <span>Bar 16</span>
        </div>
      </div>

      {/* Pattern Tracks */}
      <div className="space-y-2">
        {patterns.slice(0, maxSlots).map((pattern, index) => (
          <div key={pattern.id} className="flex items-center space-x-4">
            {/* Track Label */}
            <div className="w-32 text-sm font-medium truncate">
              {pattern.name}
            </div>
            
            {/* Pattern Block */}
            <div className="flex-1 relative h-8 bg-gray-800 rounded overflow-hidden">
              <div
                className={`absolute top-0 h-full rounded cursor-pointer transition-all ${
                  mutedPatterns.has(pattern.id)
                    ? 'bg-red-500 hover:bg-red-400 opacity-50'
                    : selectedPattern === pattern.id
                    ? 'bg-blue-500 shadow-lg'
                    : 'bg-green-500 hover:bg-green-400'
                }`}
                style={{
                  left: `${getPatternPosition(pattern, index)}%`,
                  width: `${getPatternWidth(pattern)}%`
                }}
                onClick={() => handlePatternClick(pattern.id)}
              >
                <div className="h-full flex items-center justify-center text-xs font-bold text-white">
                  {mutedPatterns.has(pattern.id) ? '🔇 ' : '🔊 '}{pattern.name}
                </div>
              </div>
            </div>

            {/* Pattern Info */}
            <div className="w-20 text-xs text-gray-400 text-right">
              {globalTempo} BPM
            </div>
          </div>
        ))}
      </div>

      {/* Pattern Details */}
      {selectedPattern && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Selected Pattern</h3>
          {(() => {
            const pattern = patterns.find(p => p.id === selectedPattern);
            if (!pattern) return null;
            
            return (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span> {pattern.name}
                </div>
                <div>
                  <span className="text-gray-400">Tempo:</span> {pattern.tempo} BPM
                </div>
                <div>
                  <span className="text-gray-400">Length:</span> {pattern.length} beats
                </div>
                <div>
                  <span className="text-gray-400">Duration:</span> {getPatternDuration(pattern).toFixed(1)}s
                </div>
                <div>
                  <span className="text-gray-400">Time Signature:</span> {pattern.timeSignature[0]}/{pattern.timeSignature[1]}
                </div>
                <div>
                  <span className="text-gray-400">Notes:</span> {pattern.notes.length}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default StepSequencer;