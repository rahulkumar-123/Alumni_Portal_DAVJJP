import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';
import useAuth from '../hooks/useAuth'; 
import { CameraIcon } from '@heroicons/react/24/solid';

export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '', bio: '', currentOrganization: '', location: '', linkedInProfile: '', phoneNumber: ''
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await userService.getUserProfile();
                setProfile(res.data.data);
                setFormData({
                    fullName: res.data.data.fullName || '',
                    bio: res.data.data.bio || '',
                    currentOrganization: res.data.data.currentOrganization || '',
                    location: res.data.data.location || '',
                    linkedInProfile: res.data.data.linkedInProfile || '',
                    phoneNumber: res.data.data.phoneNumber || ''
                });
            } catch (error) {
                toast.error("Could not fetch profile.");
            } finally {
                setLoading(false);
            }
        };

        // Only try to fetch if the user object is available
        if (user) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await userService.updateProfile(formData);
            setProfile(res.data.data);
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    if (!profile) {
        return (
            <div className="text-center p-8">
                <p className="text-red-500">Could not load profile. Please try logging in again.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-8">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <img className="h-24 w-24 rounded-full" src={profile.profilePicture || `https://ui-avatars.com/api/?name=${profile.fullName}&background=0D47A1&color=fff&size=128`} alt={profile.fullName} />
                        <div className="ml-6">
                            <h1 className="text-3xl font-bold">{profile.fullName}</h1>
                            <p className="text-gray-600">{profile.email}</p>
                            <p className="text-gray-500">Batch of {profile.batchYear} - {profile.department}</p>
                        </div>
                    </div>
                    <button onClick={() => setIsEditing(!isEditing)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                <hr className="my-6" />

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded" />
                        <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} className="w-full p-2 border rounded" rows="3"></textarea>
                        <input name="currentOrganization" placeholder="Current Organization" value={formData.currentOrganization} onChange={handleChange} className="w-full p-2 border rounded" />
                        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" />
                        <input name="linkedInProfile" placeholder="LinkedIn Profile URL" value={formData.linkedInProfile} onChange={handleChange} className="w-full p-2 border rounded" />
                        <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="w-full p-2 border rounded" />
                        <button type="submit" disabled={loading} className="w-full bg-brand-blue text-white py-2 rounded hover:bg-blue-800 disabled:bg-blue-300">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4 text-gray-700">
                        <div><strong className="font-medium text-gray-900">Bio:</strong> <p className="mt-1">{profile.bio || 'Not provided'}</p></div>
                        <div><strong className="font-medium text-gray-900">Current Organization:</strong> {profile.currentOrganization || 'Not provided'}</div>
                        <div><strong className="font-medium text-gray-900">Location:</strong> {profile.location || 'Not provided'}</div>
                        <div><strong className="font-medium text-gray-900">LinkedIn:</strong> <a href={profile.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">{profile.linkedInProfile || 'Not provided'}</a></div>
                        <div><strong className="font-medium text-gray-900">Phone:</strong> {profile.phoneNumber || 'Not provided'}</div>
                    </div>
                )}
            </div>
        </div>
    );
}