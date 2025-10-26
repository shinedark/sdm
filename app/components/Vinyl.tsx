'use client';

// Ensure this is a Client Component
import React, { useEffect, useRef } from 'react';
interface VinylProps {
  onClose: () => void;
}
const Vinyl: React.FC<VinylProps> = ({
  onClose
}) => {
  // Define the audio tracks
  const tracks = [{
    id: 1,
    title: 'Folias',
    src: '/music/folias.m4a'
  }, {
    id: 2,
    title: 'Xxas',
    src: '/music/xxas.m4a'
  }, {
    id: 3,
    title: 'Hifi',
    src: '/music/Hifi.m4a'
  }, {
    id: 4,
    title: 'Mix 1',
    src: '/music/mix1.m4a'
  }, {
    id: 5,
    title: 'Mix 2',
    src: '/music/mix2.m4a'
  }, {
    id: 6,
    title: 'Mix 3',
    src: '/music/mix3.m4a'
  }, {
    id: 7,
    title: 'Mix 4',
    src: '/music/mix4.m4a'
  }];

  // Create a ref for the modal content
  const modalRef = useRef<HTMLDivElement>(null);

  // Effect to handle closing the modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  return <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-30 p-4">
      <div ref={modalRef} className="bg-black-900 text-white rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl h-3/4 overflow-y-auto p-6">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-4 text-center">EL ARCHIVO 1</h1>
        {/* Buy Button */}
        <div className="flex justify-center mb-8 ">
          <button className="w-full h-12 bg-black text-white flex items-center justify-center rounded-full">
            Coming Soon
          </button>
        </div>

        {/* Audio Previews */}
        <div className="space-y-4">
          {tracks.map(track => <div key={track.id} className="flex flex-col items-center">
              <p className="mb-2">{track.title}</p>
              <audio controls className="w-full">
                <source src={track.src} type="audio/mp4" />
                Your browser does not support the audio element.
              </audio>
            </div>)}
        </div>
      </div>
    </div>;
};
export default Vinyl;