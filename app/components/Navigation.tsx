'use client';

import React from 'react';
import Link from 'next/link';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex space-x-8">
        {['Home', 'History', 'Apps', 'Projects'].map((section) => (
          <button
            key={section}
            onClick={() => onSectionChange(section)}
            className={`w-24 h-12 bg-black text-white flex items-center justify-center rounded-full transition-all duration-300 ${
              activeSection === section ? 'ring-2 ring-white' : ''
            }`}
          >
            {section}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation; 