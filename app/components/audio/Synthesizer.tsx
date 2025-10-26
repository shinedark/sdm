'use client';

import React, { useState, useCallback, useRef } from 'react';
import OscillatorNode, { OscillatorConfig } from './OscillatorNode';
export interface SynthesizerConfig {
  oscillators: OscillatorConfig[];
  masterVolume: number;
  reverb: {
    enabled: boolean;
    amount: number;
  };
  filter: {
    enabled: boolean;
    frequency: number;
    resonance: number;
    type: BiquadFilterType;
  };
}
export interface SynthesizerProps {
  config: SynthesizerConfig;
  isPlaying: boolean;
  onConfigChange?: (config: SynthesizerConfig) => void;
  className?: string;
}
const Synthesizer: React.FC<SynthesizerProps> = ({
  config,
  isPlaying,
  onConfigChange,
  className = ''
}) => {
  const [activeOscillators, setActiveOscillators] = useState<boolean[]>(new Array(config.oscillators.length).fill(true));
  const handleOscillatorChange = useCallback((index: number, newConfig: OscillatorConfig) => {
    const updatedOscillators = [...config.oscillators];
    updatedOscillators[index] = newConfig;
    onConfigChange?.({
      ...config,
      oscillators: updatedOscillators
    });
  }, [config, onConfigChange]);
  const handleMasterVolumeChange = useCallback((volume: number) => {
    onConfigChange?.({
      ...config,
      masterVolume: volume
    });
  }, [config, onConfigChange]);
  const handleReverbChange = useCallback((enabled: boolean, amount: number) => {
    onConfigChange?.({
      ...config,
      reverb: {
        enabled,
        amount
      }
    });
  }, [config, onConfigChange]);
  const handleFilterChange = useCallback((filterConfig: SynthesizerConfig['filter']) => {
    onConfigChange?.({
      ...config,
      filter: filterConfig
    });
  }, [config, onConfigChange]);
  const toggleOscillator = useCallback((index: number) => {
    const updated = [...activeOscillators];
    updated[index] = !updated[index];
    setActiveOscillators(updated);
  }, [activeOscillators]);
  const addOscillator = useCallback(() => {
    const newOscillator: OscillatorConfig = {
      type: 'sine',
      frequency: 440,
      detune: 0,
      volume: 0.5,
      attack: 0.1,
      decay: 0.1,
      sustain: 0.7,
      release: 0.3
    };
    onConfigChange?.({
      ...config,
      oscillators: [...config.oscillators, newOscillator]
    });
    setActiveOscillators([...activeOscillators, true]);
  }, [config, onConfigChange, activeOscillators]);
  const removeOscillator = useCallback((index: number) => {
    if (config.oscillators.length > 1) {
      const updatedOscillators = config.oscillators.filter((_, i) => i !== index);
      const updatedActive = activeOscillators.filter((_, i) => i !== index);
      onConfigChange?.({
        ...config,
        oscillators: updatedOscillators
      });
      setActiveOscillators(updatedActive);
    }
  }, [config, onConfigChange, activeOscillators]);
  return <div className={`synthesizer p-6 border rounded-lg bg-gray-900 text-white ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Synthesizer</h2>
        <div className="flex space-x-2">
          <button onClick={addOscillator} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
            + Add Oscillator
          </button>
        </div>
      </div>

      {/* Master Controls */}
      <div className="mb-6 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold mb-4">Master Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Master Volume */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Master Volume: {(config.masterVolume * 100).toFixed(0)}%
            </label>
            <input type="range" min="0" max="1" step="0.01" value={config.masterVolume} onChange={e => handleMasterVolumeChange(parseFloat(e.target.value))} className="w-full" />
          </div>

          {/* Reverb */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <input type="checkbox" checked={config.reverb.enabled} onChange={e => handleReverbChange(e.target.checked, config.reverb.amount)} className="rounded" />
              <label className="text-sm font-medium">Reverb</label>
            </div>
            {config.reverb.enabled && <input type="range" min="0" max="1" step="0.01" value={config.reverb.amount} onChange={e => handleReverbChange(true, parseFloat(e.target.value))} className="w-full" />}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <input type="checkbox" checked={config.filter.enabled} onChange={e => handleFilterChange({
            ...config.filter,
            enabled: e.target.checked
          })} className="rounded" />
            <label className="text-sm font-medium">Filter</label>
          </div>
          
          {config.filter.enabled && <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs mb-1">Frequency</label>
                <input type="range" min="20" max="20000" step="1" value={config.filter.frequency} onChange={e => handleFilterChange({
              ...config.filter,
              frequency: parseFloat(e.target.value)
            })} className="w-full" />
              </div>
              <div>
                <label className="block text-xs mb-1">Resonance</label>
                <input type="range" min="0" max="30" step="0.1" value={config.filter.resonance} onChange={e => handleFilterChange({
              ...config.filter,
              resonance: parseFloat(e.target.value)
            })} className="w-full" />
              </div>
              <div>
                <label className="block text-xs mb-1">Type</label>
                <select value={config.filter.type} onChange={e => handleFilterChange({
              ...config.filter,
              type: e.target.value as BiquadFilterType
            })} className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-xs">
                  <option value="lowpass">Lowpass</option>
                  <option value="highpass">Highpass</option>
                  <option value="bandpass">Bandpass</option>
                  <option value="notch">Notch</option>
                </select>
              </div>
            </div>}
        </div>
      </div>

      {/* Oscillators */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Oscillators ({config.oscillators.length})</h3>
        
        {config.oscillators.map((oscillator, index) => <div key={index} className="relative">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-md font-medium">Oscillator {index + 1}</h4>
              <div className="flex items-center space-x-2">
                <button onClick={() => toggleOscillator(index)} className={`px-3 py-1 rounded text-xs ${activeOscillators[index] ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
                  {activeOscillators[index] ? 'ON' : 'OFF'}
                </button>
                {config.oscillators.length > 1 && <button onClick={() => removeOscillator(index)} className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs">
                    Remove
                  </button>}
              </div>
            </div>
            
            <OscillatorNode config={oscillator} isPlaying={isPlaying && activeOscillators[index]} onFrequencyChange={frequency => handleOscillatorChange(index, {
          ...oscillator,
          frequency
        })} onVolumeChange={volume => handleOscillatorChange(index, {
          ...oscillator,
          volume
        })} className="bg-gray-800" />
          </div>)}
      </div>

      {/* Status */}
      <div className="mt-6 p-3 bg-gray-800 rounded">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              {isPlaying ? 'Playing' : 'Stopped'} | 
              {activeOscillators.filter(Boolean).length} of {config.oscillators.length} oscillators active
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Master: {(config.masterVolume * 100).toFixed(0)}% | 
            Reverb: {config.reverb.enabled ? `${(config.reverb.amount * 100).toFixed(0)}%` : 'OFF'} |
            Filter: {config.filter.enabled ? 'ON' : 'OFF'}
          </div>
        </div>
      </div>
    </div>;
};
export default Synthesizer;