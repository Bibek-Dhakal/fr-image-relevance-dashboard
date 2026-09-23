import { useEffect, useState } from 'react';
import { type Image } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export default function ImagesView() {
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/images/`);
            if (!res.ok) throw new Error('Failed to fetch images');
            const data = await res.json();
            setImages(data);
        } catch (error: unknown) {
            const e = error as Error;
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-gray-500 text-center mt-10">Loading image library...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Image Library</h2>
                <button 
                    onClick={fetchImages}
                    className="bg-white border border-gray-300 px-4 py-2 rounded-md text-sm shadow-sm hover:bg-gray-50"
                >
                    Refresh
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((img) => (
                    <div key={img.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                            {/* Note: In a real prod app with external URLs, handle image loading errors gracefully */}
                            <img 
                                src={img.url} 
                                alt={img.subject || 'image'} 
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Failed+to+Load'; }}
                            />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    img.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    img.status === 'flagged' ? 'bg-yellow-100 text-yellow-800' :
                                    img.status === 'failed' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                    {img.status.toUpperCase()}
                                </span>
                                {img.confidence !== null && (
                                    <span className="text-xs text-gray-500 font-mono">
                                        Conf: {img.confidence.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <h3 className="font-semibold text-gray-900 mt-1 capitalize truncate">
                                {img.subject || 'Unknown Subject'}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2 capitalize">
                                {img.category || 'No Category'}
                            </p>
                            
                            {img.attributes && img.attributes.length > 0 && (
                                <div className="mt-auto flex flex-wrap gap-1">
                                    {img.attributes.slice(0, 3).map((attr, idx) => (
                                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                            {attr}
                                        </span>
                                    ))}
                                    {img.attributes.length > 3 && (
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                            +{img.attributes.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {images.length === 0 && (
                <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                    No images found. Did you run the seed script?
                </div>
            )}
        </div>
    );
}