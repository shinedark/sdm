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

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-4 z-20">
      <div className="container mx-auto flex justify-center space-x-6">
        <a
          href="https://soundcloud.com/shinedark"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 inline-block"
        >
          <FontAwesomeIcon icon={faSoundcloud} size="2x" />
        </a>
        <a
          href="https://www.mixcloud.com/shinedark/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 inline-block"
        >
          <FontAwesomeIcon icon={faMixcloud} size="2x" />
        </a>
        <a
          href="https://www.twitch.tv/shinedarkmusic"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 inline-block"
        >
          <FontAwesomeIcon icon={faTwitch} size="2x" />
        </a>
        <a
          href="https://www.youtube.com/channel/UCVbJWtMZ4rF1SpDBLC2E8wg?view_as=subscriber"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 inline-block"
        >
          <FontAwesomeIcon icon={faYoutube} size="2x" />
        </a>
        <a
          href="https://open.spotify.com/artist/6Ch6jH9Q2wxd3im5IRYFoF"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 inline-block"
        >
          <FontAwesomeIcon icon={faSpotify} size="2x" />
        </a>
        <a
          href="https://music.apple.com/us/artist/shine-dark/993072837"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 inline-block"
        >
          <FontAwesomeIcon icon={faApple} size="2x" />
        </a>
        <a
          href="https://www.instagram.com/shinedarkmusic/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 inline-block"
        >
          <FontAwesomeIcon icon={faInstagram} size="2x" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
