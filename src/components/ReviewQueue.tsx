import {useEffect, useState} from 'react';
import {type Review} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export default function ReviewQueue() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/reviews/`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error: unknown) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        try {
            const res = await fetch(`${API_BASE}/reviews/${id}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action})
            });
            if (res.ok) {
                // Update local state instead of full refetch to be snappy
                setReviews(prev => prev.map(r => r.id === id ? {...r, human_status: `human_${action}d`} : r));
            }
        } catch (error: unknown) {
            console.error(`Failed to ${action} review`, error);
        }
    };

    if (loading) return <div className="text-center mt-10 text-gray-500">Loading queue...</div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Review Queue</h2>
                    <p className="text-sm text-gray-500 mt-1">Human-in-the-loop moderation for AI matches.</p>
                </div>
                <button
                    onClick={fetchReviews}
                    className="w-full sm:w-auto bg-white border border-gray-300 px-4 py-2 rounded-md text-sm shadow-sm hover:bg-gray-50 transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">AI
                                Status
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Human
                                Override
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {reviews.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 sm:px-6 py-12 text-center text-gray-500 text-sm">
                                    No reviews in queue. Go to Match Tester to generate some!
                                </td>
                            </tr>
                        )}
                        {reviews.map((rev) => (
                            <tr key={rev.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                    {new Date(rev.created_at).toLocaleString()}
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full ${
                                            rev.ai_status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {rev.ai_status.toUpperCase()}
                                        </span>
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-700 max-w-[200px] sm:max-w-md truncate">
                                    {rev.ai_reason}
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {rev.human_status ? (
                                        <span className={`px-2 py-1 text-[10px] sm:text-xs rounded border ${
                                            rev.human_status.includes('approve')
                                                ? 'border-green-200 bg-green-50 text-green-700'
                                                : 'border-red-200 bg-red-50 text-red-700'
                                        }`}>
                                                {rev.human_status.toUpperCase()}
                                            </span>
                                    ) : (
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleAction(rev.id, 'approve')}
                                                className="text-green-600 hover:text-green-900 border border-green-200 bg-green-50 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(rev.id, 'reject')}
                                                className="text-red-600 hover:text-red-900 border border-red-200 bg-red-50 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
