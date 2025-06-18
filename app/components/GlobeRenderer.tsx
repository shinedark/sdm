import './GlobeRenderer.css'
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
    return withoutExtension
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export function GlobeRenderer({ name, imageUrl, audioFiles }: GlobeRendererProps) {
    const { play } = useAudio();
    const [isHovered, setIsHovered] = useState(false);
    const [isListOpen, setIsListOpen] = useState(false);

    function handleGlobeClick() {
        setIsListOpen(open => !open);
    }

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto mt-16 mb-20 px-4">
            {/* Globe/Album Art */}
            <div
                className="relative mb-6 cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleGlobeClick}
                onTouchStart={handleGlobeClick}
                tabIndex={0}
                role="button"
                aria-pressed={isListOpen}
            >
                <div className="ball">
                    <div
                        className="ball-texture"
                        style={{
                            backgroundImage: `url(${imageUrl})`
                        }}
                    />
                    <div className="shadow" />
                </div>
            </div>
            {/* Album Info */}
            <div className="w-full text-center mb-6">
                <h2 className="text-2xl font-bold text-white">{name}</h2>
                {/* Add artist/year if available */}
            </div>
            {/* Track List: Show if hovered or open */}
            {(isHovered || isListOpen) && (
                <ul className="w-full bg-black/80 rounded-lg overflow-hidden shadow-lg">
                    {audioFiles.map((file, idx) => (
                        <li key={file.name} className="border-b border-white/10 last:border-b-0">
                            <button
                                className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors font-medium"
                                onClick={() => play({
                                    id: file.url,
                                    title: file.name,
                                    url: file.url,
                                    date: '',
                                    isFavorite: false
                                })}
                            >
                                {idx + 1}. {formatTheName(file.name)}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GlobeRenderer; 