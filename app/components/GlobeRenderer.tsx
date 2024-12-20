import './GlobeRenderer.css'
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
        <div className="absolute inset-0 overflow-y-auto">
            <div className="min-h-[300vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                    {response.blobs.map((blob, index) => (
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 