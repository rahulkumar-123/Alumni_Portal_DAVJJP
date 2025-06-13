import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

// Simple SVG icons to avoid adding a new library
const LinkedInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10s-10 4.477-10 10c0 5.013 3.694 9.153 8.5 9.875v-7.001h-2.5v-2.874h2.5v-2.155c0-2.484 1.488-3.864 3.753-3.864.639 0 1.34.113 1.942.203v2.559h-1.342c-1.258 0-1.658.784-1.658 1.581v1.676h2.95l-.465 2.874h-2.485v7.001c4.806-.722 8.5-4.862 8.5-9.875z" /></svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.252 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z" /></svg>;

export default function AlumniDetailModal({ user, onClose }) {
    if (!user) return null;

    const profileImageUrl = user.profilePicture?.startsWith('http') ? user.profilePicture : user.profilePicture && user.profilePicture !== 'no-photo.jpg' ? `${API_URL}${user.profilePicture}` : `https://ui-avatars.com/api/?name=${user.fullName}&background=8344AD&color=fff&size=128`;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg relative animate-zoomIn" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-on-surface p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="p-8 text-center">
                    <img src={profileImageUrl} alt={user.fullName} className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg -mt-24" />
                    <h2 className="text-3xl font-bold text-on-surface mt-4">{user.fullName}</h2>
                    <p className="text-lg text-primary font-semibold">Batch of {user.batchYear}</p>

                    <div className="flex justify-center items-center gap-4 mt-4">
                        {user.linkedInProfile && <a href={user.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary"><LinkedInIcon /></a>}
                        {user.instagramProfile && <a href={user.instagramProfile} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary"><InstagramIcon /></a>}
                        {user.facebookProfile && <a href={user.facebookProfile} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary"><FacebookIcon /></a>}
                    </div>
                </div>

                <div className="border-t p-8 space-y-4 text-left">
                    {user.bio && <div><strong className="text-on-surface block">Bio</strong><p className="text-muted">{user.bio}</p></div>}
                    <div><strong className="text-on-surface block">Company / Institute</strong><p className="text-muted">{user.currentOrganization || 'Not provided'}</p></div>
                    <div><strong className="text-on-surface block">Location</strong><p className="text-muted">{user.location || 'Not provided'}</p></div>
                    <div><strong className="text-on-surface block">Email</strong><p className="text-muted">{user.email}</p></div>
                </div>
            </div>
            <style>{`
                @keyframes zoomIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-zoomIn { animation: zoomIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
            `}</style>
        </div>
    );
}

