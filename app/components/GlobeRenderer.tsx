import './GlobeRenderer.css';
import React, { useState } from 'react';
import { useAudio } from '../context/audio-context';
interface AudioFile {
  name: string;
  url: string;
}
interface GlobeRendererProps {
  name: string;
  imageUrl: string;
  audioFiles: AudioFile[];
}
function formatTheName(name: string) {
  const withoutPrefix = name.replace(/^.*?- /, '');
  const withoutExtension = withoutPrefix.replace(/\.[^/.]+$/, '');
  return withoutExtension.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
export function GlobeRenderer({
  name,
  imageUrl,
  audioFiles
}: GlobeRendererProps) {
  const {
    play
  } = useAudio();
  const [isHovered, setIsHovered] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  function handleGlobeClick() {
    setIsListOpen(open => !open);
  }
  return <div className="flex flex-col items-center w-full max-w-md mx-auto mt-16 mb-20 px-4">
            {/* Globe/Album Art */}
            <div className="relative mb-6 cursor-pointer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handleGlobeClick} onTouchStart={handleGlobeClick} tabIndex={0} role="button" aria-pressed={isListOpen}>
                <div className="ball">
                    <div className="ball-texture" style={{
          backgroundImage: `url(${imageUrl})`
        }} />
                    <div className="shadow" />
                </div>
            </div>
            {/* Album Info */}
            <div className="w-full text-center mb-6">
                <h2 className="text-2xl font-bold text-white">{name}</h2>
                {/* Add artist/year if available */}
            </div>
          
        </div>;
}
export default GlobeRenderer;