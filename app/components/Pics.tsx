import { list } from '@vercel/blob';

// This is a Server Component
export default async function Pics() {
    const response = await list();

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Test Blob List</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {response.blobs.map((blob) => (
                    <div key={blob.pathname} className="relative">
                        <img
                            src={blob.url}
                            alt={blob.pathname}
                            className="w-full h-64 object-cover rounded-lg"
                        />
                        <a
                            href={blob.downloadUrl}
                            className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm hover:bg-black/70"
                        >
                            {blob.pathname}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}