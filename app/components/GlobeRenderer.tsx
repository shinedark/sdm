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
            <div className="min-h-[300vh] mt-10 mb-10">
                <div className="flex flex-wrap justify-center gap-8 p-6 m-6">
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