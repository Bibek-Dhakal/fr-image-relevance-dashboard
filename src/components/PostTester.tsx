import { useState } from 'react';
import { type MatchSuggestion } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export default function PostTester() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<MatchSuggestion | null>(null);

    const handleTest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // 1. Create Post
            const postRes = await fetch(`${API_BASE}/posts/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            
            if (!postRes.ok) throw new Error('Failed to create post');
            const postData = await postRes.json();

            // 2. Run Matcher
            const matchRes = await fetch(`${API_BASE}/posts/${postData.id}/images`);
            if (!matchRes.ok) throw new Error('Failed to run match engine');
            const matchData = await matchRes.json();
            
            setResult(matchData);
        } catch (error: unknown) {
            const e = error as Error;
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Test Post</h2>
                <p className="text-sm text-gray-500 mb-6">See how the Mismatch Guard reacts to your writing.</p>
                
                <form onSubmit={handleTest} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Post Title</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                            placeholder="e.g., The clever Red Fox"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content Summary</label>
                        <textarea 
                            className="w-full px-4 py-2 border border-gray-300 rounded-md h-32 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                            placeholder="Write about the topic here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Processing Match...' : 'Find Best Image'}
                    </button>
                </form>
                
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                        {error}
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full min-h-[400px]">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Matching Result</h2>
                
                {!result && !loading && (
                    <div className="flex-1 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        Submit a post to see results
                    </div>
                )}
                
                {loading && (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                        Generating vector embeddings...
                    </div>
                )}

                {result && (
                    <div className="flex flex-col space-y-4">
                        <div className={`p-4 rounded-lg border ${
                            result.status === 'ACCEPTED' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className={`font-bold ${result.status === 'ACCEPTED' ? 'text-green-700' : 'text-red-700'}`}>
                                    {result.status}
                                </span>
                                {result.similarity_score && (
                                    <span className="text-sm font-mono text-gray-500">
                                        Score: {result.similarity_score.toFixed(3)}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-800">{result.reason}</p>
                        </div>

                        {result.image_url && (
                            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <img 
                                    src={result.image_url} 
                                    alt="Matched candidate" 
                                    className="w-full h-64 object-cover"
                                />
                                {result.image_tags && (
                                    <div className="p-3 text-sm bg-white border-t border-gray-200 flex justify-between">
                                        <span className="font-medium capitalize text-gray-700">
                                            {result.image_tags.subject}
                                        </span>
                                        <span className="text-gray-500 capitalize">
                                            {result.image_tags.category}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}