'use client';

import React, { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react';
import ToneEngine, { ToneInstrument } from './ToneEngine';
export interface ToneContextState {
  instruments: Map<string, ToneInstrument>;
  isInitialized: boolean;
  isStarted: boolean;
  createInstrument: (id: string, options?: {
    type?: 'synth' | 'fmsynth' | 'amsynth' | 'duosynth' | 'monosynth';
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    volume?: number;
  }) => ToneInstrument | null;
  playNote: (instrumentId: string, frequency: string | number, duration?: string | number, velocity?: number) => void;
  stopAll: () => void;
  updateInstrument: (instrumentId: string, updates: Partial<ToneInstrument>) => void;
  getAllInstruments: () => ToneInstrument[];
  getInstrument: (id: string) => ToneInstrument | undefined;
  startTone: () => Promise<void>;
}
const ToneContext = createContext<ToneContextState | null>(null);
export interface ToneProviderProps {
  children: ReactNode;
}
export const ToneProvider: React.FC<ToneProviderProps> = ({
  children
}) => {
  const [instruments, setInstruments] = useState<Map<string, ToneInstrument>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const handleInstrumentCreate = useCallback((instrument: ToneInstrument) => {
    setInstruments(prev => new Map(prev.set(instrument.id, instrument)));
    setIsInitialized(true);
  }, []);
  const handleInstrumentUpdate = useCallback((instrumentId: string, updates: Partial<ToneInstrument>) => {
    setInstruments(prev => {
      const newInstruments = new Map(prev);
      const existingInstrument = newInstruments.get(instrumentId);
      if (existingInstrument) {
        newInstruments.set(instrumentId, {
          ...existingInstrument,
          ...updates
        });
      }
      return newInstruments;
    });
  }, []);
  const handleInstrumentDestroy = useCallback((instrumentId: string) => {
    setInstruments(prev => {
      const newInstruments = new Map(prev);
      newInstruments.delete(instrumentId);
      return newInstruments;
    });
  }, []);
  const createInstrument = useCallback((id: string, options?: {
    type?: 'synth' | 'fmsynth' | 'amsynth' | 'duosynth' | 'monosynth';
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    volume?: number;
  }) => {
    // This will be handled by the ToneEngine component
    return null;
  }, []);
  const playNote = useCallback((instrumentId: string, frequency: string | number, duration: string | number = '8n', velocity: number = 1) => {
    // This will be handled by the ToneEngine component
  }, []);
  const stopAll = useCallback(() => {
    // This will be handled by the ToneEngine component
  }, []);
  const updateInstrument = useCallback((instrumentId: string, updates: Partial<ToneInstrument>) => {
    // This will be handled by the ToneEngine component
  }, []);
  const getAllInstruments = useCallback(() => {
    return Array.from(instruments.values());
  }, [instruments]);
  const getInstrument = useCallback((id: string) => {
    return instruments.get(id);
  }, [instruments]);
  const startTone = useCallback(async () => {
    // This will be handled by the ToneEngine component
  }, []);
  const contextValue: ToneContextState = {
    instruments,
    isInitialized,
    isStarted,
    createInstrument,
    playNote,
    stopAll,
    updateInstrument,
    getAllInstruments,
    getInstrument,
    startTone
  };
  return <ToneContext.Provider value={contextValue}>
      <ToneEngine onInstrumentCreate={handleInstrumentCreate} onInstrumentUpdate={handleInstrumentUpdate} onInstrumentDestroy={handleInstrumentDestroy} />
      {children}
    </ToneContext.Provider>;
};
export const useTone = (): ToneContextState => {
  const context = useContext(ToneContext);
  if (!context) {
    throw new Error('useTone must be used within a ToneProvider');
  }
  return context;
};