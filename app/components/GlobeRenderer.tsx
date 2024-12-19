type GlobeRendererProps = {
    response: {
        blobs: {
            pathname: string;
            url: string;
        }[];
    };
}

export default function GlobeRenderer({ response }: GlobeRendererProps) {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="animate-scroll h-[200vh] will-change-transform">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                    {response.blobs.map((blob) => (
                        <div key={`original-${blob.pathname}`} className="relative m-2">
                            <img
                                src={blob.url}
                                alt={blob.pathname}
                                className="w-full h-48 sm:h-40 object-cover rounded-lg opacity-20"
                            />
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                    {response.blobs.map((blob) => (
                        <div key={`duplicate-${blob.pathname}`} className="relative m-2">
                            <img
                                src={blob.url}
                                alt={blob.pathname}
                                className="w-full h-48 sm:h-40 object-cover rounded-lg opacity-20"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 