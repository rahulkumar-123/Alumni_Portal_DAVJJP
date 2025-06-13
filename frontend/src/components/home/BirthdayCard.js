import React from 'react';
import { CakeIcon, XMarkIcon } from '@heroicons/react/24/solid';
// ... API_URL logic ...
export default function BirthdayCard({ user, onDismiss }) {
    // ... profileImageUrl logic ...
    return (
        <div className="bg-surface rounded-xl shadow-lg p-4 flex items-center space-x-4 relative transition transform hover:-translate-y-1">
            <button onClick={() => onDismiss(user._id)} className="absolute top-2 right-2 text-muted hover:text-on-surface">
                <XMarkIcon className="w-5 h-5" />
            </button>
            <img src={profileImageUrl} alt={user.fullName} className="w-16 h-16 rounded-full object-cover" />
            <div className="flex-1">
                <p className="font-bold text-on-surface">{user.fullName}</p>
                <p className="text-sm text-muted">Batch of {user.batchYear}</p>
            </div>
            <CakeIcon className="w-8 h-8 text-primary-light" />
        </div>
    );
}