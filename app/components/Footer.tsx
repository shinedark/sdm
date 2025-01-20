import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSoundcloud,
  faMixcloud,
  faTwitch,
  faYoutube,
  faSpotify,
  faApple,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import Navigation from './Navigation';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black text-white py-1 z-40">
      <Navigation />
      <div className="container mx-auto flex justify-center gap-3 sm:gap-4 md:gap-6 overflow-x-auto py-1">
        <a
          href="https://soundcloud.com/shinedark"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faSoundcloud} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </a>
        <a
          href="https://www.mixcloud.com/shinedark/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faMixcloud} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </a>
        <a
          href="https://www.twitch.tv/shinedarkmusic"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faTwitch} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </a>
        <a
          href="https://www.youtube.com/channel/UCVbJWtMZ4rF1SpDBLC2E8wg"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faYoutube} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </a>
        <a
          href="https://open.spotify.com/artist/6Ch6jH9Q2wxd3im5IRYFoF"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faSpotify} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </a>
        <a
          href="https://music.apple.com/us/artist/shine-dark/993072837"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faApple} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </a>
        <a
          href="https://www.instagram.com/shinedarkmusic/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faInstagram} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </a>
      </div>
      <div className="flex items-center justify-center">
        <h1 className="font-bold text-sm">
          <a className="contact hover:text-gray-400 transition-colors duration-300"
            href="mailto:shinedarkmusic@gmail.com">
            CONTACT US
          </a>
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
