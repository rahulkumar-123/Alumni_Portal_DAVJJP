import React, { useState, useEffect } from "react";
import userService from "../services/userService";
import toast from "react-hot-toast";
import Spinner from "../components/common/Spinner";
import useAuth from "../hooks/useAuth";
import { CameraIcon } from "@heroicons/react/24/solid";

const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        bio: "",
        currentOrganization: "",
        location: "",
        linkedInProfile: "",
        instagramProfile: "",
        facebookProfile: '',
        phoneNumber: "",
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await userService.getUserProfile();
                setProfile(res.data.data);
                setFormData({
                    fullName: res.data.data.fullName || "",
                    bio: res.data.data.bio || "",
                    currentOrganization: res.data.data.currentOrganization || "",
                    location: res.data.data.location || "",
                    linkedInProfile: res.data.data.linkedInProfile || "",
                    instagramProfile: res.data.data.instagramProfile || '',
                    facebookProfile: res.data.data.facebookProfile || '',
                    phoneNumber: res.data.data.phoneNumber || "",
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

    // Add this function to handle profile picture upload
    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        const formData = new FormData();
        formData.append("profilePicture", file);

        setUploading(true);
        try {
            const res = await userService.updateProfilePicture(formData);
            setProfile((prev) => ({
                ...prev,
                profilePicture: res.data.data.profilePicture,
            }));
            toast.success("Profile picture updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile picture");
        } finally {
            setUploading(false);
        }
    };
    console.log("Profile data:", profile);
    if (loading) return <Spinner />;

    if (!profile) {
        return (
            <div className="text-center p-8">
                <p className="text-red-500">
                    Could not load profile. Please try logging in again.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-8">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <div className="relative group">
                            <img
                                className="h-24 w-24 rounded-full object-cover"
                                src={
                                    profile.profilePicture?.startsWith("http")
                                        ? profile.profilePicture
                                        : profile.profilePicture !== "no-photo.jpg"
                                            ? `${API_URL}${profile.profilePicture}`
                                            : `https://ui-avatars.com/api/?name=${profile.fullName}&background=8344AD&color=fff`
                                }
                                alt={profile.fullName}
                            />
                            <label className="absolute bottom-0 right-0 bg-brand-blue text-white rounded-full p-2 cursor-pointer group-hover:bg-blue-700">
                                <CameraIcon className="h-4 w-4" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleProfilePictureChange}
                                    disabled={uploading}
                                />
                            </label>
                            {uploading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>
                        <div className="ml-6">
                            <h1 className="text-3xl font-bold">{profile.fullName}</h1>
                            <p className="text-gray-600">{profile.email}</p>
                            <p className="text-gray-500">
                                Batch of {profile.batchYear} - {profile.department}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-gray-items text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                </div>

                <hr className="my-6" />

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        <textarea
                            name="bio"
                            placeholder="Bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows="3"
                        ></textarea>
                        <input
                            name="currentOrganization"
                            placeholder="Current Organization"
                            value={formData.currentOrganization}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            name="location"
                            placeholder="Location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            name="linkedInProfile"
                            placeholder="LinkedIn Profile URL"
                            value={formData.linkedInProfile}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        <input name="instagramProfile" placeholder="Instagram Profile URL" value={formData.instagramProfile} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                        <input name="facebookProfile" placeholder="Facebook Profile URL" value={formData.facebookProfile} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                        <input
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors disabled:bg-primary-light"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4 text-gray-700">
                        <div>
                            <strong className="font-medium text-gray-900">Bio:</strong>{" "}
                            <p className="mt-1">{profile.bio || "Not provided"}</p>
                        </div>
                        <div>
                            <strong className="font-medium text-gray-900">
                                Current Organization:
                            </strong>{" "}
                            {profile.currentOrganization || "Not provided"}
                        </div>
                        <div>
                            <strong className="font-medium text-gray-900">Location:</strong>{" "}
                            {profile.location || "Not provided"}
                        </div>
                        <div>
                            <strong className="font-medium text-gray-900">LinkedIn:</strong>{" "}
                            <a
                                href={profile.linkedInProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-blue hover:underline"
                            >
                                {profile.linkedInProfile || "Not provided"}
                            </a>
                        </div>
                        <div>
                            <strong className="font-medium text-gray-900">Phone:</strong>{" "}
                            {profile.phoneNumber || "Not provided"}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}