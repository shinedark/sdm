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
    { section: 'About', image: '/images/apps.png' },
    { section: 'Projects', image: '/images/projects.png' }
  ];

  return (
    <nav
      className="z-50 fixed top-4 left-0 w-[43vw] md:top-4 md:left-1/2 md:w-auto md:transform md:-translate-x-1/2 md:fixed md:w-auto md:bg-transparent"
    >
      <div
        className="flex flex-col md:flex-row md:space-x-16 space-y-4 md:space-y-0 fixed left-0 top-1/4 md:static md:top-auto md:left-auto md:transform-none bg-transparent md:bg-transparent p-2 md:p-0 md:w-auto"
      >
        {navigationItems.map(({ section, image }) => (
          <button
            key={section}
            onClick={() => onSectionChange(section)}
            className={`w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-transparent flex items-center justify-center rounded-full transition-all duration-300 ${
              activeSection === section ? 'ring-2 ring-black' : ''
            }`}
          >
            <div className="relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20">
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