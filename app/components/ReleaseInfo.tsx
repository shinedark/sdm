'use client';

import React from 'react';

interface Release {
  name: string;
  date: string;
}

const releases: Release[] = [
  { name: '& El Ritmo', date: '2/12/25' },
  { name: '& TU ?', date: '2/28/25' },
  { name: 'Academico', date: '5/4/21' },
  { name: 'Acsh', date: '10/6/20' },
  { name: 'Archive', date: '7/8/21' },
  { name: 'Awww Life', date: '1/5/21' },
  { name: 'C-Am', date: '5/10/16' },
  { name: 'Cee', date: '1/7/21' },
  { name: 'Daft Chills', date: '1/25/18' },
  { name: 'DAYTIME VANDAL 1', date: '11/10/22' },
  { name: 'DAYTIME VANDAL 2', date: '11/11/22' },
  { name: 'DAYTIME VANDAL 3', date: '11/9/22' },
  { name: 'DAYTIME VANDAL LOST TAPES', date: '11/10/22' },
  { name: 'Far', date: '11/9/16' },
  { name: 'Fasd (Edit)', date: '9/27/18' },
  { name: 'Galaxter Retro', date: '4/1/21' },
  { name: 'GoodVibes', date: '7/9/15' },
  { name: 'Groove Box', date: '9/19/21' },
  { name: 'Hifi', date: '11/5/19' },
  { name: 'High Voltage', date: '10/7/22' },
  { name: 'Holiver', date: '3/19/19' },
  { name: 'JOYITA', date: '2/27/25' },
  { name: 'Joyita', date: '2/6/24' },
  { name: 'Kols (Edit)', date: '10/17/18' },
  { name: 'Lado', date: '1/12/21' },
  { name: 'LAS CUMBIAS FUTBOLERAS', date: '3/8/25' },
  { name: 'Light Projections', date: '11/29/21' },
  { name: 'Loop For Heart', date: '11/19/23' },
  { name: 'Loop For Mind', date: '11/19/23' },
  { name: 'Loop For Thought', date: '11/19/23' },
  { name: 'Loopita', date: '8/31/21' },
  { name: 'Lopas (Edit)', date: '10/10/18' },
  { name: 'Lova', date: '6/20/21' },
  { name: 'Machine Man Soul', date: '5/7/15' },
  { name: 'Maols', date: '10/6/20' },
  { name: 'Melvin', date: '12/30/20' },
  { name: 'Mo U', date: '4/14/21' },
  { name: 'My Rock', date: '1/30/18' },
  { name: 'Night Love', date: '2/3/21' },
  { name: 'Olps', date: '7/24/21' },
  { name: 'Paradox Of Illusion', date: '1/7/25' },
  { name: 'Pin Pan', date: '2/27/25' },
  { name: 'Raw Materials', date: '8/4/21' },
  { name: 'Remastered', date: '3/5/18' },
  { name: 'Rock N Rolla', date: '2/16/21' },
  { name: 'Soft Kill Jams', date: '7/2/24' },
  { name: 'Soul Matter', date: '3/22/21' },
  { name: 'Sunday School', date: '11/12/21' },
  { name: 'Surgery', date: '7/14/21' },
  { name: 'Swan', date: '6/7/15' },
  { name: 'Sweet Pretty Thing', date: '10/6/20' },
  { name: 'Take It', date: '7/17/21' },
  { name: 'Talo', date: '2/6/18' },
  { name: 'Tax Commission', date: '10/25/21' },
  { name: 'Test Controll 123', date: '8/23/21' },
  { name: 'Troy', date: '9/9/21' },
  { name: 'Unnecessary Feedback Ok', date: '5/31/21' },
  { name: 'Vol 2', date: '10/2/18' },
  { name: 'Wolf Call', date: '3/26/19' }
];

interface ReleaseInfoProps {
  imageName: string;
}

const ReleaseInfo: React.FC<ReleaseInfoProps> = ({ imageName }) => {
  const findClosestMatch = (name: string): Release | null => {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    return releases.find(release => {
      const normalizedRelease = release.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalizedRelease.includes(normalizedName) || normalizedName.includes(normalizedRelease);
    }) || null;
  };

  const release = findClosestMatch(imageName);

  if (!release) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg shadow-lg z-50">
      <h3 className="text-lg font-bold mb-2">{release.name}</h3>
      <p className="text-sm">{`Released: ${release.date}`}</p>
    </div>
  );
};

export default ReleaseInfo; 