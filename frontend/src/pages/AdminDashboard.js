import React, { useState } from 'react';
import PendingUsers from '../components/admin/PendingUsers';
import PendingPosts from '../components/admin/PendingPosts';
import ViewFeedback from '../components/admin/ViewFeedback';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');

    const tabs = [
        { id: 'users', name: 'Pending Registrations' },
        { id: 'posts', name: 'Pending Posts' },
        { id: 'feedback', name: 'View Feedback' }
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${activeTab === tab.id
                                    ? 'border-brand-blue text-brand-blue'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            <div>
                {activeTab === 'users' && <PendingUsers />}
                {activeTab === 'posts' && <PendingPosts />}
                {activeTab === 'feedback' && <ViewFeedback />}
            </div>
        </div>
    );
}
