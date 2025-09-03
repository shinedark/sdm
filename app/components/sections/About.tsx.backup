'use client';

import React from 'react';

interface About {
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  secondaryVideoUrl?: string;
  features?: string[];
  techStack?: string[];
  link?: string;
}

const abouts: About[] = [
  {
    title: 'HEALTH',
    description: 'Wheather is using calesthenics to stay in shape or golf to rewire the brain and build new neural pathways. Eating as clean as possible so the body can function at its best. Contact me to work as a guide for anyone going through this journey.',
    videoUrl: '/videos/pullup.mp4',
    secondaryVideoUrl: '/videos/putt.mov',
    link: 'https://shinedark.github.io/guide/',
  },
  {
    title: 'MUSIC',
    description: 'Tune into the world of SHINE DARK and the music that is being created liveo n twitch since 2021. All edtiz and Planetario Radio mixes are done there too. Since 2015 pushing the envelope of what is possible with music and technology. Also used to rewire brain and build new neural pathways.',
    imageUrl: '/images/6.png',
    link: 'https://music.apple.com/us/artist/shine-dark/993072837',
  },
  {
    title: 'CODE',
    description: 'AS SEEN ON THIS SITE. Or peep the code portfolio.',
    imageUrl: '/images/code.png',
    link: 'https://shinedark.dev/',
  },
];

const AboutCard: React.FC<{ about: About }> = ({ about }) => {
  const [showSecondVideo, setShowSecondVideo] = React.useState(false);

  const handleVideoEnd = () => {
    if (about.secondaryVideoUrl) setShowSecondVideo(true);
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl p-6 mb-8 mt-20 mb-20 border border-gray-200 shadow-lg items-center md:items-stretch">
      {/* Left: Title and Description */}
      <div className="flex-1 flex flex-col justify-center md:pr-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">{about.title}</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">{about.description}</p>
        {about.link && (
          <a
            href={about.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full transition-colors duration-300 mt-2"
          >
            Visit {about.title}
          </a>
        )}
      </div>
      {/* Right: Image or Video */}
      <div className="w-full md:w-64 flex-shrink-0 flex justify-center items-center mt-6 md:mt-0">
        {about.videoUrl ? (
          !showSecondVideo ? (
            <video
              src={about.videoUrl}
              controls
              className="rounded-lg w-full h-40 object-cover shadow-md"
              poster={about.imageUrl}
              onEnded={handleVideoEnd}
            />
          ) : about.secondaryVideoUrl ? (
            <video
              src={about.secondaryVideoUrl}
              controls
              autoPlay
              className="rounded-lg w-full h-40 object-cover shadow-md"
              poster={about.imageUrl}
            />
          ) : null
        ) : about.imageUrl ? (
          <img
            src={about.imageUrl}
            alt={about.title}
            className="rounded-lg w-full h-40 object-cover shadow-md"
            loading="lazy"
          />
        ) : null}
      </div>
    </div>
  );
};

const AboutSection: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-8 mb-20 mt-20 pl-[10vw] md:pl-0">
      <div className="max-w-4xl mx-auto ">
        <h1 className="text-4xl font-bold mb-8 mt-20 text-center text-gray-900">About</h1>
        <h3 className="text-center text-gray-600 mb-8">WE ARE AVEILABLE TO CONSTULT ON ANY OF THIS AREAS. </h3>
        <div className="space-y-8 mt-20 mb-20">
          {abouts.map((about, index) => (
            <AboutCard key={index} about={about} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutSection; 
