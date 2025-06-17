'use client';
import { useEffect, useState } from 'react';
import GlobeRenderer from './GlobeRenderer';
import type { list } from '@vercel/blob';

type BlobResponse = Awaited<ReturnType<typeof list>>;

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
  { name: 'DAYTIME VANDAL 1', date: '11/10/22' },
  { name: 'DAYTIME VANDAL 2', date: '11/11/22' },
  { name: 'DAYTIME VANDAL 3', date: '11/9/22' },
  { name: 'DAYTIME VANDAL LOST TAPES', date: '11/10/22' },
  { name: 'Far', date: '11/9/16' },
  { name: 'Fasd (Edit)', date: '9/27/18' },
  { name: 'Galaxter Retro', date: '4/1/21' },
  { name: 'Groove Box', date: '9/19/21' },
  { name: 'Hifi', date: '11/5/19' },
  { name: 'High Voltage', date: '10/7/22' },
  { name: 'Holiver', date: '3/19/19' },
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
  { name: 'Maols', date: '10/6/20' },
  { name: 'Melvin', date: '12/30/20' },
  { name: 'Mo U', date: '4/14/21' },
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
  { name: 'Tax Commission', date: '10/25/21' },
  { name: 'Test Controll 123', date: '8/23/21' },
  { name: 'Troy', date: '9/9/21' },
  { name: 'Unnecessary Feedback Ok', date: '5/31/21' },
  { name: 'Vol 2', date: '10/2/18' },
  { name: 'Wolf Call', date: '3/26/19' }
];

interface ReleaseWithImage extends Release {
  imageUrl: string;
  imageName: string;
}

type BlobWithRelease = BlobResponse['blobs'][0] & {
    date: string;
    title: string;
};

type ModifiedBlobResponse = Omit<BlobResponse, 'blobs'> & {
    blobs: BlobWithRelease[];
};

export default function GlobeGallery() {
    const [response, setResponse] = useState<ModifiedBlobResponse | null>(null);
    const [error, setError] = useState<boolean>(false);

    const calculateSimilarity = (str1: string, str2: string): number => {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) return 1.0;

        const longerLength = longer.length;
        const shorterLength = shorter.length;

        // Count matching characters
        let matches = 0;
        for (let i = 0; i < shorterLength; i++) {
            if (longer.includes(shorter[i])) {
                matches++;
            }
        }

        return matches / longerLength;
    };

    const findClosestMatch = (name: string, downloadUrl: string): Release | null => {
        // Extract the relevant part from downloadUrl
        const baseUrl = "https://naetb5ccw3lndeod.public.blob.vercel-storage.com/";
        const urlPart = downloadUrl
            .replace(baseUrl, '')
            .split('-')[0]  // Get everything before the first '-'
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .trim();

        // Normalize the input name
        const normalizedName = name.toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .trim();

        console.log('Matching:', { urlPart, normalizedName }); // Debug log

        // First try exact match with the URL part
        const exactMatch = releases.find(release => {
            const normalizedRelease = release.name.toLowerCase()
                .replace(/[^a-z0-9]/g, '')
                .trim();
            return normalizedRelease === urlPart;
        }) || null;

        if (exactMatch) return exactMatch;

        // Try matching with the pathname
        const pathnameMatch = releases.find(release => {
            const normalizedRelease = release.name.toLowerCase()
                .replace(/[^a-z0-9]/g, '')
                .trim();
            return normalizedRelease === normalizedName;
        }) || null;

        if (pathnameMatch) return pathnameMatch;

        // Special cases for acronyms
        if (normalizedName === 'dtv1') return releases.find(r => r.name === 'DAYTIME VANDAL 1') || null;
        if (normalizedName === 'dtv2') return releases.find(r => r.name === 'DAYTIME VANDAL 2') || null;
        if (normalizedName === 'dtv3') return releases.find(r => r.name === 'DAYTIME VANDAL 3') || null;
        if (normalizedName === 'asch') return releases.find(r => r.name === 'Acsh') || null;
        if (normalizedName === 'awwlife') return releases.find(r => r.name === 'Awww Life') || null;

        // If no exact match, try partial match
        const partialMatch = releases.find(release => {
            const normalizedRelease = release.name.toLowerCase()
                .replace(/[^a-z0-9]/g, '')
                .trim();
            return normalizedRelease.includes(urlPart) || urlPart.includes(normalizedRelease);
        }) || null;

        return partialMatch;
    };

    useEffect(() => {
        fetch('/api/blobs')
            .then(res => res.json())
            .then(result => {
                if (result?.blobs) {
                    const blobsWithReleases = result.blobs.map((blob: BlobResponse['blobs'][0]) => {
                        const imageName = blob.pathname.split('.')[0];
                        const release = findClosestMatch(imageName, blob.downloadUrl);
                        // Use the matched release data
                        return {
                            ...blob,
                            title: release?.name || blob.pathname.split('.')[0],
                            date: release?.date || 'Unknown'
                        };
                    });

                    // Sort blobs by date
                    const sortedBlobs = blobsWithReleases.sort((a: BlobWithRelease, b: BlobWithRelease) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        return dateB.getTime() - dateA.getTime();
                    });
                    
                    setResponse({ ...result, blobs: sortedBlobs } as ModifiedBlobResponse);
                }
            })
            .catch(err => {
                console.error('Error fetching blobs:', err);
                setError(true);
            });
    }, []);

    if (error) return <div>Error loading images</div>;
    if (!response) return <div>Loading...</div>;

    return (
        <div className="w-full h-full overflow-y-auto">
            <div className="container mx-auto px-4 py-8">
                <GlobeRenderer response={response} />
            </div>
        </div>
    );
}