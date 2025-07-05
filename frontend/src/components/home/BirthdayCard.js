import React from 'react';
import { CakeIcon, XMarkIcon } from '@heroicons/react/24/solid';

const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export default function BirthdayCard({ user, onDismiss }) {

    // It determines which image to show: the uploaded one or a default avatar.
    const profileImageUrl = user.profilePicture?.startsWith('http')
        ? user.profilePicture
        : user.profilePicture && user.profilePicture !== 'no-photo.jpg'
            ? `${API_URL}${user.profilePicture}`
            : `https://ui-avatars.com/api/?name=${user.fullName}&background=A066CB&color=fff`;

    return (
        <div className="bg-primary/10 border border-purple-200 rounded-xl shadow-lg p-4 flex items-center space-x-4 relative transition-all duration-300 hover:shadow-xl hover:scale-105">
            <button
                onClick={() => onDismiss(user._id)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Dismiss"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
            <div className="relative">
                <img src={profileImageUrl} alt={user.fullName} className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-200" />
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-1">
                    <CakeIcon className="w-4 h-4 text-white" />
                </div>
            </div>
            <div className="flex-1">
                <p className="font-bold text-gray-800 text-lg">{user.fullName}</p>
                <p className="text-sm text-purple-600 font-medium">Batch of {user.batchYear}</p>
                <p className="text-xs text-gray-500 mt-1">🎉 Happy Birthday!</p>
            </div>
        </div>
    );
}
