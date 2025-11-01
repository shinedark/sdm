'use client';

import React from 'react';
import Documentary from '../Documentary';
interface Project {
  title: string;
  description: string;
  features: string[];
  techStack: string[];
  link: string;
  isFeatured?: boolean;
}

// Featured El Turbo Lazer Ecosystem
const turboLazerEcosystem = {
  title: 'El Turbo Lazer - Complete Vehicle Security Ecosystem',
  description: 'A comprehensive multi-language vehicle security system that combines cutting-edge hardware with advanced software to create a modern security solution at a fraction of commercial costs. Built for a 1972 Datsun Z-Series V8 custom build, this system demonstrates how DIY solutions can surpass commercial offerings.',
  features: ['Multi-language architecture (Python, Rust, C++, JavaScript) working in harmony', 'Policy-based security engine with custom YAML/JSON rule definitions', 'Autonomous drone integration with MAVLink protocol for aerial surveillance', 'Real-time monitoring dashboard with live camera feeds and GPS tracking', '24/7 operation with Raspberry Pi 5 + ESP32-CAM array + sensor suite', 'Cost-effective: $800-1000 total vs $5000+ commercial systems', 'Superior customization and autonomous response capabilities'],
  techStack: ['Python', 'Rust', 'C++', 'JavaScript', 'React', 'Raspberry Pi 5', 'ESP32-CAM', 'MAVLink', 'OpenCV', 'Three.js'],
  link: 'https://github.com/shinedark/EL-TURBO-LAZER',
  isFeatured: true
};
const connectedApps = [{
  title: 'AUTO-RUST-AI-EDITOR (SD AI IDE)',
  description: 'Custom Cursor AI IDE clone specifically designed for SD-RUST language development. Features Monaco editor with wave theory syntax highlighting, Tauri + React desktop app, and 13.66% optimized build system ready for MLX integration.',
  features: ['Monaco editor with SD-RUST syntax highlighting', 'Wave theory and sensor fusion code completion', '13.66% bundle size reduction through optimization', 'MLX integration ready for local AI inference', 'Strict black and white terminal aesthetic', 'Real-time development analytics dashboard'],
  techStack: ['Tauri', 'React', 'TypeScript', 'Monaco Editor', 'Rust', 'MLX'],
  link: 'https://github.com/shinedark/AUTO-RUST-AI-EDITOR'
}, {
  title: 'AUTO-RUST-LANGUAGE',
  description: 'Custom programming language for wave theory and sensor fusion. Provides specialized syntax for wave modules, sensor arrays, and wave functions with built-in support for ESP32-CAM, PIR, Ultrasonic, and ToF sensors.',
  features: ['wave_module declarations for sensor systems', 'sensor_array configurations with ESP32-CAM support', 'wave_fn and power_fn functions for analysis', 'Built-in FFT and cross-correlation analysis', 'Zero-cost abstractions for embedded systems', 'Memory-safe Rust implementation'],
  techStack: ['Rust', 'LLVM', 'Wave Theory', 'FFT', 'Cross-correlation'],
  link: 'https://github.com/shinedark/AUTO-RUST-LANGUAGE'
}, {
  title: 'ELRITMO-C',
  description: 'High-performance C implementation of rhythm and wave detection algorithms. Used in real-time car system processing for audio and sensor analysis with maximum efficiency.',
  features: ['High-performance audio/sensor analysis', 'Real-time rhythm detection algorithms', 'Optimized for embedded systems', 'Cross-platform C implementation', 'Integration with car system processing'],
  techStack: ['C', 'FFT', 'Audio Processing', 'Embedded Systems'],
  link: 'https://github.com/shinedark/ELRITMO-C'
}, {
  title: 'ELRITMO-RUST',
  description: 'Rust implementation for memory-safe wave analysis with zero-cost abstractions for embedded systems. Integrates seamlessly with the Turbo Lazer communication stack.',
  features: ['Memory-safe wave analysis implementation', 'Zero-cost abstractions for embedded systems', 'Integration with Turbo Lazer communication stack', 'High-performance sensor data processing', 'Cross-platform compatibility'],
  techStack: ['Rust', 'Embedded Systems', 'Wave Analysis', 'Memory Safety'],
  link: 'https://github.com/shinedark/ELRITMO-RUST'
}, {
  title: 'Wave-Core Systems',
  description: 'Core algorithms for wave theory implementation with cross-platform C/Rust implementations. Forms the foundation for all sensor fusion work in the ecosystem.',
  features: ['Core wave theory algorithms', 'Cross-platform (C/Rust) implementations', 'Foundation for all sensor fusion work', 'Optimized for real-time processing', 'Modular architecture for easy integration'],
  techStack: ['C', 'Rust', 'Wave Theory', 'Sensor Fusion', 'Real-time Processing'],
  link: 'https://github.com/shinedark/SD-WAVE-CORE'
}];
const hardwareIntegration = {
  title: 'Hardware Integration & Cost Analysis',
  description: 'Complete hardware setup for the 1972 Datsun Z-Series V8 custom build, demonstrating how modern technology can be integrated into classic vehicles at a fraction of commercial costs.',
  components: [{
    name: 'Raspberry Pi 5 (8GB)',
    price: 80,
    role: 'Main processing unit and system controller'
  }, {
    name: 'ESP32-CAM modules (8x)',
    price: 80,
    role: 'Distributed camera network for 360° coverage'
  }, {
    name: 'Sensors suite',
    price: 150,
    role: 'PIR, ultrasonic, temperature, voltage monitoring'
  }, {
    name: 'Drone integration',
    price: 400,
    role: 'MAVLink-compatible drone for aerial surveillance'
  }, {
    name: 'Misc hardware',
    price: 100,
    role: 'Relays, GPS, 4G module, power management'
  }],
  totalCost: 810,
  comparison: 'Commercial systems: $5000+ | DIY solution: $810 | Savings: 84%'
};
const otherProjects: Project[] = [{
  title: 'Planetaria Radio',
  description: 'Planetaria Radio is a unique platform that combines music streaming with blockchain technology. Users can stream music tracks, and if they have a specific polygon NFT in their wallet, they can upload tracks. Each track is stored as an encrypted file on IPFS, ensuring decentralized and secure storage. Track metadata and ownership are managed through smart contracts on Sepolia blockchain.',
  features: ['Create and upload music tracks with associated metadata', 'Play and stream music directly from the platform', 'Track play counts and engagement using blockchain technology', 'Decentralized file storage ensures longevity and resistance to censorship', 'NFT integration allows for unique ownership and potential monetization of tracks'],
  techStack: ['React', 'GraphQL & Apollo Client', 'Polygon', 'Styled Components', 'IPFS', 'Remix', 'Ethereum Sepolia', 'Solidity', 'Hardhat'],
  link: 'https://planetaria-rdo.onrender.com/'
}, {
  title: 'My Med Story',
  description: 'Creates history to be shared with new doctors or anyone who wants to comprehend more about my health treatment.',
  features: ['Log medications, supplements, history, informations', 'Share with doctors or family', 'Protected by blockchain technology'],
  techStack: ['React', 'GraphQL', 'Web3'],
  link: 'https://tribe-made-frontend.onrender.com/'
}, {
  title: 'SHINE DARK Recovery Guide',
  description: 'A comprehensive mental health recovery guide that combines personal experience with creative expression. This project serves as both a resource and a creative outlet for understanding and navigating mental health recovery.',
  features: ['Personal journey documentation', 'Creative media integration', 'Resource sharing and community support', 'Interactive timeline of recovery', 'Artistic expression through various media'],
  techStack: ['HTML', 'CSS', 'JavaScript'],
  link: 'https://shinedark.github.io/guide/'
}, {
  title: 'Noise Machine Sampler',
  description: 'Toy Mobile App',
  features: ['12 slots available to load', 'Each slot has 6 sounds to pick from', 'Search and preview samples before loading', 'Interactive slot loading system', 'Real-time sound preview functionality'],
  techStack: ['React Native', 'Expo'],
  link: 'https://github.com/shinedark/NoiseMachineSampler'
}, {
  title: 'Remastered AR Experience',
  description: 'An augmented reality experience created for the promotion of the Remastered album. This interactive app brings the album artwork to life through AR technology.',
  features: ['Interactive AR album artwork visualization', 'Real-time 3D model rendering', 'Album promotion through immersive experience', 'Cross-platform compatibility', 'Interactive elements tied to album tracks'],
  techStack: ['React Native', 'AR Kit', 'AR Core', 'Expo', 'Three.js'],
  link: 'https://github.com/shinedark/remastered'
}];
const ProjectCard: React.FC<{
  project: Project;
}> = ({
  project
}) => {
  return <div className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-8 border-2 border-gray-800 shadow-lg ${project.isFeatured ? 'ring-2 ring-gray-700' : ''}`}>
      <h2 className="text-3xl font-bold mb-4 text-gray-900">{project.title}</h2>
      <p className="text-gray-700 mb-6 leading-relaxed">{project.description}</p>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Key Features:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {project.features.map((feature, index) => <li key={index}>{feature}</li>)}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Tech Stack:</h3>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech, index) => <span key={index} className="px-3 py-1 bg-gray-300 border border-gray-600 rounded-full text-sm text-gray-900 font-medium">
              {tech}
            </span>)}
        </div>
      </div>

      <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-gray-900 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition-colors duration-300">
        View Project
      </a>
    </div>;
};
const ConnectedAppCard: React.FC<{
  app: Project;
}> = ({
  app
}) => {
  return <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 mb-6 border-2 border-gray-700">
      <h3 className="text-xl font-bold mb-3 text-gray-900">{app.title}</h3>
      <p className="text-gray-700 mb-4 text-sm leading-relaxed">{app.description}</p>
      
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2 text-gray-900">Features:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
          {app.features.map((feature, index) => <li key={index}>{feature}</li>)}
        </ul>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {app.techStack.map((tech, index) => <span key={index} className="px-2 py-1 bg-gray-300 border border-gray-600 rounded text-xs text-gray-900 font-medium">
              {tech}
            </span>)}
        </div>
      </div>

      <a href={app.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors duration-300 text-sm">
        View Code
      </a>
    </div>;
};
const Projects: React.FC = () => {
  return <div className="min-h-screen bg-white text-black p-8 mb-20 mt-20 pl-[10vw] md:pl-0">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 mt-20 text-center">Projects</h1>
        <Documentary />
        
        {/* Featured: El Turbo Lazer Ecosystem */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-2">Featured Project</h2>
            <p className="text-gray-600">Complete vehicle security ecosystem</p>
          </div>
          
          <ProjectCard project={turboLazerEcosystem} />
          
          {/* Connected Applications */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Connected Applications</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {connectedApps.map((app, index) => <ConnectedAppCard key={index} app={app} />)}
            </div>
          </div>

          {/* Hardware Integration */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">{hardwareIntegration.title}</h3>
            <p className="text-gray-600 mb-6">{hardwareIntegration.description}</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-900">Component Breakdown:</h4>
                <div className="space-y-3">
                  {hardwareIntegration.components.map((component, index) => <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{component.name}</div>
                        <div className="text-sm text-gray-600">{component.role}</div>
                      </div>
                      <div className="font-bold text-gray-900">${component.price}</div>
                    </div>)}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">Cost Analysis</h4>
                <div className="text-3xl font-bold text-green-600 mb-2">${hardwareIntegration.totalCost}</div>
                <p className="text-sm text-gray-600 mb-4">Total System Cost</p>
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  <strong>Cost Comparison:</strong><br />
                  {hardwareIntegration.comparison}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <strong>Mac Pro Integration:</strong><br />
                  Processing server and development workstation for music analysis, AI model training, and remote deployment to the car's Mini PC as part of the distributed compute architecture.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Projects */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Other Projects</h2>
          <div className="space-y-8">
            {otherProjects.map((project, index) => <ProjectCard key={index} project={project} />)}
          </div>
        </div>
      </div>
    </div>;
};
export default Projects;