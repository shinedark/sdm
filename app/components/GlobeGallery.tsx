'use client';
import { useEffect, useState } from 'react';
import GlobeRenderer from './GlobeRenderer';
import type { list } from '@vercel/blob';

type BlobResponse = Awaited<ReturnType<typeof list>>;

export default function GlobeGallery() {
    const [response, setResponse] = useState<BlobResponse | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        fetch('/api/blobs')
            .then(res => res.json())
            .then(result => setResponse(result))
            .catch(err => {
                console.error('Error fetching blobs:', err);
                setError(true);
            });
    }, []);

    if (error) return <div>Error loading images</div>;
    if (!response) return <div>Loading...</div>;

    return <GlobeRenderer response={response} />;
}