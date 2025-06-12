import React from 'react';
import { CakeIcon } from '@heroicons/react/24/solid';
const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");
export default function BirthdayCard({ user }) {
    const profileImageUrl = user.profilePicture?.startsWith('http') ? user.profilePicture : user.profilePicture !== 'no-photo.jpg' ? `${API_URL}${user.profilePicture}` : `https://ui-avatars.com/api/?name=${user.fullName}&background=A066CB&color=fff`;
    return (<div className="bg-surface rounded-xl shadow-lg p-4 flex items-center space-x-4 transition transform hover:-translate-y-1"><img src={profileImageUrl} alt={user.fullName} className="w-16 h-16 rounded-full object-cover" /><div className="flex-1"><p className="font-bold text-on-surface">{user.fullName}</p><p className="text-sm text-muted">Batch of {user.batchYear}</p></div><CakeIcon className="w-8 h-8 text-primary-light" /></div>);
}
