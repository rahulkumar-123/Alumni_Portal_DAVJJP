import React from 'react';

const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export default function BirthdayCard({ user, onDismiss }) {

    const profileImageUrl = user.profilePicture?.startsWith('http')
        ? user.profilePicture
        : user.profilePicture && user.profilePicture !== 'no-photo.jpg'
            ? `${API_URL}${user.profilePicture}`
            : `https://ui-avatars.com/api/?name=${user.fullName}&background=f5a623&color=080808`;

    return (
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 hover:border-primary/30 transition-all duration-200">
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Profile Picture */}
                <div className="relative">
                    <img
                        src={profileImageUrl}
                        alt={user.fullName}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-primary/30 shadow-sm"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-background text-xs sm:text-sm font-bold">🎂</span>
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-on-surface text-sm sm:text-base truncate">
                        {user.fullName}
                    </h3>
                    <p className="text-muted text-xs sm:text-sm">
                        Class of {user.batchYear}
                    </p>
                    {user.currentOrganization && (
                        <p className="text-muted text-xs truncate">
                            {user.currentOrganization}
                        </p>
                    )}
                </div>

                {/* Dismiss Button */}
                <button
                    onClick={() => onDismiss(user._id)}
                    className="p-1.5 sm:p-2 text-muted hover:text-on-surface hover:bg-white/10 rounded-full transition-colors duration-200 flex-shrink-0"
                    title="Dismiss"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
