import {useState} from 'react';
import ImagesView from './components/ImagesView';
import PostTester from './components/PostTester';
import ReviewQueue from './components/ReviewQueue';

type Tab = 'images' | 'tester' | 'reviews';

function App() {
    const [activeTab, setActiveTab] = useState<Tab>('images');

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <span
                                className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                                FoxGuard
                            </span>
                            <span className="ml-2 text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                Admin Dashboard
                            </span>
                        </div>
                        <nav className="flex space-x-1">
                            <TabButton
                                isActive={activeTab === 'images'}
                                onClick={() => setActiveTab('images')}
                            >
                                Image Library
                            </TabButton>
                            <TabButton
                                isActive={activeTab === 'tester'}
                                onClick={() => setActiveTab('tester')}
                            >
                                Match Tester
                            </TabButton>
                            <TabButton
                                isActive={activeTab === 'reviews'}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Review Queue
                            </TabButton>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'images' && <ImagesView/>}
                {activeTab === 'tester' && <PostTester/>}
                {activeTab === 'reviews' && <ReviewQueue/>}
            </main>
        </div>
    );
}

function TabButton({isActive, onClick, children}: {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
            {children}
        </button>
    );
}

export default App;
