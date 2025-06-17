'use client';

import React from 'react';
import Image from 'next/image';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const navigationItems = [
    { section: 'Home', image: '/images/home.png' },
    { section: 'EL ARCHIVO', image: '/images/elarchivo.png' },
    { section: 'Apps', image: '/images/apps.png' },
    { section: 'Projects', image: '/images/projects.png' }
  ];

  return (
    <nav className=" fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex space-x-16">
        {navigationItems.map(({ section, image }) => (
          <button
            key={section}
            onClick={() => onSectionChange(section)}
            className={`w-20 h-20 bg-transparent flex items-center justify-center rounded-full transition-all duration-300 ${
              activeSection === section ? 'ring-2 ring-black' : ''
            }`}
          >
            <div className="relative w-20 h-20">
              <Image
                src={image}
                alt={section}
                fill
                sizes="60px"
                className="object-contain p-2"
                priority
                quality={100}
              />
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation; 