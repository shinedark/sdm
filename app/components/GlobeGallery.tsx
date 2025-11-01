'use client';

import { useEffect, useState } from 'react';
import GlobeRenderer from './GlobeRenderer';
interface Release {
  name: string;
  date: string;
}

// const releases: Release[] = [
//   { name: '& El Ritmo', date: '2/12/25' },
//   { name: '& TU ?', date: '2/28/25' },
//   { name: 'Academico', date: '5/4/21' },
//   { name: 'Acsh', date: '10/6/20' },
//   { name: 'Archive', date: '7/8/21' },
//   { name: 'Awww Life', date: '1/5/21' },
//   { name: 'C-Am', date: '5/10/16' },
//   { name: 'Cee', date: '1/7/21' },
//   { name: 'DAYTIME VANDAL 1', date: '11/10/22' },
//   { name: 'DAYTIME VANDAL 2', date: '11/11/22' },
//   { name: 'DAYTIME VANDAL 3', date: '11/9/22' },
//   { name: 'DAYTIME VANDAL LOST TAPES', date: '11/10/22' },
//   { name: 'Far', date: '11/9/16' },
//   { name: 'Fasd (Edit)', date: '9/27/18' },
//   { name: 'Galaxter Retro', date: '4/1/21' },
//   { name: 'Groove Box', date: '9/19/21' },
//   { name: 'Hifi', date: '11/5/19' },
//   { name: 'High Voltage', date: '10/7/22' },
//   { name: 'Holiver', date: '3/19/19' },
//   { name: 'Joyita', date: '2/6/24' },
//   { name: 'Kols (Edit)', date: '10/17/18' },
//   { name: 'Lado', date: '1/12/21' },
//   { name: 'LAS CUMBIAS FUTBOLERAS', date: '3/8/25' },
//   { name: 'Light Projections', date: '11/29/21' },
//   { name: 'Loop For Heart', date: '11/19/23' },
//   { name: 'Loop For Mind', date: '11/19/23' },
//   { name: 'Loop For Thought', date: '11/19/23' },
//   { name: 'Loopita', date: '8/31/21' },
//   { name: 'Lopas (Edit)', date: '10/10/18' },
//   { name: 'Lova', date: '6/20/21' },
//   { name: 'Maols', date: '10/6/20' },
//   { name: 'Melvin', date: '12/30/20' },
//   { name: 'Mo U', date: '4/14/21' },
//   { name: 'Night Love', date: '2/3/21' },
//   { name: 'Olps', date: '7/24/21' },
//   { name: 'Paradox Of Illusion', date: '1/7/25' },
//   { name: 'Pin Pan', date: '2/27/25' },
//   { name: 'Raw Materials', date: '8/4/21' },
//   { name: 'Remastered', date: '3/5/18' },
//   { name: 'Rock N Rolla', date: '2/16/21' },
//   { name: 'Soft Kill Jams', date: '7/2/24' },
//   { name: 'Soul Matter', date: '3/22/21' },
//   { name: 'Sunday School', date: '11/12/21' },
//   { name: 'Surgery', date: '7/14/21' },
//   { name: 'Swan', date: '6/7/15' },
//   { name: 'Sweet Pretty Thing', date: '10/6/20' },
//   { name: 'Take It', date: '7/17/21' },
//   { name: 'Tax Commission', date: '10/25/21' },
//   { name: 'Test Controll 123', date: '8/23/21' },
//   { name: 'Troy', date: '9/9/21' },
//   { name: 'Unnecessary Feedback Ok', date: '5/31/21' },
//   { name: 'Vol 2', date: '10/2/18' },
//   { name: 'Wolf Call', date: '3/26/19' }
// ];

interface ReleaseWithImage extends Release {
  imageUrl: string;
  imageName: string;
}
interface AudioFolder {
  name: string;
  imageUrl: string;
  audioFiles: {
    name: string;
    url: string;
  }[];
}
const folders: AudioFolder[] = [{
  name: 'ARCHIVE',
  imageUrl: '/music/ARCHIVE/archive.jpg',
  audioFiles: [{
    name: 'SHINE DARK - pampam.mp3',
    url: '/music/ARCHIVE/SHINE DARK - pampam.mp3'
  }, {
    name: 'SHINE DARK - mola.mp3',
    url: '/music/ARCHIVE/SHINE DARK - mola.mp3'
  }, {
    name: 'SHINE DARK - CLUB.mp3',
    url: '/music/ARCHIVE/SHINE DARK - CLUB.mp3'
  }, {
    name: 'SHINE DARK - ARCHIVE.mp3',
    url: '/music/ARCHIVE/SHINE DARK - ARCHIVE.mp3'
  }]
}
// Add more folders as needed
];
export default function GlobeGallery() {
  return <div className="w-full h-full overflow-y-auto">
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {folders.map(folder => <GlobeRenderer key={folder.name} name={folder.name} imageUrl={folder.imageUrl} audioFiles={folder.audioFiles} />)}
            </div>
        </div>;
}