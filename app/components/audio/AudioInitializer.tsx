'use client';

import React, { useState } from 'react';
import { useAudioContext } from './AudioContextProvider';
export interface AudioInitializerProps {
  children: React.ReactNode;
  className?: string;
}
const AudioInitializer: React.FC<AudioInitializerProps> = ({
  children,
  className = ''
}) => {
  const {
    isInitialized,
    initializeAudioContext
  } = useAudioContext();
  const [isInitializing, setIsInitializing] = useState(false);
  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await initializeAudioContext();
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    } finally {
      setIsInitializing(false);
    }
  };
  if (isInitialized) {
    return <>{children}</>;
  }
  return <div className={`audio-initializer min-h-screen bg-gray-900 text-white flex items-center justify-center ${className}`}>
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Audio System Ready</h1>
          <p className="text-gray-300 mb-6">
            Click the button below to initialize the audio system. This is required by your browser for security reasons.
          </p>
        </div>

        <button onClick={handleInitialize} disabled={isInitializing} className={`px-8 py-4 rounded-lg font-bold text-lg transition-colors ${isInitializing ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}>
          {isInitializing ? <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Initializing Audio...</span>
            </div> : '🎵 Initialize Audio System'}
        </button>

        <div className="mt-8 text-sm text-gray-400">
          <p className="mb-2">Required permissions:</p>
          <ul className="text-left space-y-1">
            <li>• Audio Context (Web Audio API)</li>
            <li>• MIDI Access (Web MIDI API)</li>
            <li>• Microphone (if using audio input)</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg text-sm">
          <p className="text-yellow-400 font-medium mb-2">Why is this needed?</p>
          <p className="text-gray-300">
            Modern browsers require user interaction before allowing audio playback to prevent unwanted sounds and respect user preferences.
          </p>
        </div>
      </div>
    </div>;
};
export default AudioInitializer;