import './GlobeRenderer.css'
import type { list } from '@vercel/blob';
type BlobResponse = Awaited<ReturnType<typeof list>>;

type BlobWithRelease = BlobResponse['blobs'][0] & {
    title: string;
    date: string;
};

type ModifiedBlobResponse = Omit<BlobResponse, 'blobs'> & {
    blobs: BlobWithRelease[];
};

type GlobeRendererProps = {
    response: ModifiedBlobResponse;
}

export default function GlobeRenderer({ response }: GlobeRendererProps) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 mb-20 ml-10 mr-10">
            {response.blobs.map((blob) => (
                <div
                    key={`original-${blob.pathname}`}
                    className="stage"
                >
                    <div className="ball">
                        <div
                            className="ball-texture"
                            style={{
                                backgroundImage: `url(${blob.url})`
                            }}
                        />
                        <div className="shadow" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-2 rounded-b-lg text-center">
                        <h3 className="text-sm font-bold">{blob.title}</h3>
                        <p className="text-xs">{`Released: ${blob.date}`}</p>
                    </div>
                </div>
            ))}
        </div>
    );
} 