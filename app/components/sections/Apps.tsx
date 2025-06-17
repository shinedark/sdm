'use client';

import React from 'react';

interface App {
  title: string;
  description: string;
  features: string[];
  techStack: string[];
  link: string;
}

const apps: App[] = [
  {
    title: 'Noise Machine Sampler',
    description: 'Toy Mobile App',
    features: [
      '12 slots available to load',
      'Each slot has 6 sounds to pick from',
      'Search and preview samples before loading',
      'Interactive slot loading system',
      'Real-time sound preview functionality'
    ],
    techStack: [
      'React Native',
      'Expo'
    ],
    link: 'https://github.com/shinedark/NoiseMachineSampler'
  },
  {
    title: 'Remastered AR Experience',
    description: 'An augmented reality experience created for the promotion of the Remastered album. This interactive app brings the album artwork to life through AR technology.',
    features: [
      'Interactive AR album artwork visualization',
      'Real-time 3D model rendering',
      'Album promotion through immersive experience',
      'Cross-platform compatibility',
      'Interactive elements tied to album tracks'
    ],
    techStack: [
      'React Native',
      'AR Kit',
      'AR Core',
      'Expo',
      'Three.js'
    ],
    link: 'https://github.com/shinedark/remastered'
  }
];

const AppCard: React.FC<{ app: App }> = ({ app }) => {
  return (
    <div
      className="bg-white rounded-xl p-6 mb-8 mt-20 mb-20 border border-gray-200 shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-900">{app.title}</h2>
      <p className="text-gray-600 mb-6 leading-relaxed">{app.description}</p>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Key Features:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          {app.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Tech Stack:</h3>
        <div className="flex flex-wrap gap-2">
          {app.techStack.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <a
        href={app.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full transition-colors duration-300"
      >
        View Project
      </a>
    </div>
  );
};

const Apps: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-8 mb-20 mt-20">
      <div className="max-w-4xl mx-auto ">
        <h1 className="text-4xl font-bold mb-8 mt-20 text-center text-gray-900">Mobile Apps</h1>
        <div className="space-y-8">
          {apps.map((app, index) => (
            <AppCard key={index} app={app} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Apps; 
