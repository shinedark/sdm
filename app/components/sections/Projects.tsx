'use client';

import React from 'react';
import Documentary from '../Documentary';

interface Project {
  title: string;
  description: string;
  features: string[];
  techStack: string[];
  link: string;
}

const projects: Project[] = [
  {
    title: 'Planetaria Radio',
    description: 'Planetaria Radio is a unique platform that combines music streaming with blockchain technology. Users can stream music tracks, and if they have a specific polygon NFT in their wallet, they can upload tracks. Each track is stored as an encrypted file on IPFS, ensuring decentralized and secure storage. Track metadata and ownership are managed through smart contracts on Sepolia blockchain.',
    features: [
      'Create and upload music tracks with associated metadata',
      'Play and stream music directly from the platform',
      'Track play counts and engagement using blockchain technology',
      'Decentralized file storage ensures longevity and resistance to censorship',
      'NFT integration allows for unique ownership and potential monetization of tracks'
    ],
    techStack: [
      'React',
      'GraphQL & Apollo Client',
      'Polygon',
      'Styled Components',
      'Pinata & IPFS',
      'Remix',
      'Ethereum Sepolia',
      'Solidity',
      'Hardhat'
    ],
    link: 'https://planetaria-rdo.onrender.com/'
  },
  {
    title: 'My Med Story',
    description: 'Creates history to be shared with new doctors or anyone who wants to comprehend more about my health treatment.',
    features: [
      'Log medications, supplements, history, informations',
      'Share with doctors or family',
      'Protected by blockchain technology'
    ],
    techStack: [
      'React',
      'GraphQL',
      'Web3'
    ],
    link: 'https://tribe-made-frontend.onrender.com/'
  },
  {
    title: 'SHINE DARK Recovery Guide',
    description: 'A comprehensive mental health recovery guide that combines personal experience with creative expression. This project serves as both a resource and a creative outlet for understanding and navigating mental health recovery.',
    features: [
      'Personal journey documentation',
      'Creative media integration',
      'Resource sharing and community support',
      'Interactive timeline of recovery',
      'Artistic expression through various media'
    ],
    techStack: [
      'HTML',
      'CSS',
      'JavaScript'
    ],
    link: 'https://shinedark.github.io/guide/'
  },
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

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div
      className="bg-white rounded-xl p-6 mb-8 mt-20 mb-20 border border-gray-200 shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-900">{project.title}</h2>
      <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Key Features:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          {project.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Tech Stack:</h3>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech, index) => (
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
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full transition-colors duration-300"
      >
        View Project
      </a>
    </div>
  );
};

const Projects: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black p-8 mb-20 mt-20 pl-[10vw] md:pl-0">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8  mt-20 text-center">Projects</h1>
        <Documentary />
        <div className="space-y-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects; 