import React from 'react';
import { 
  XMarkIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  BuildingOfficeIcon, 
  AcademicCapIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon
} from '@heroicons/react/24/solid';

const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

// Enhanced SVG icons with better styling
const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function AlumniDetailModal({ user, onClose }) {
    if (!user) return null;

    const profileImageUrl = user.profilePicture?.startsWith('http') 
        ? user.profilePicture 
        : user.profilePicture && user.profilePicture !== 'no-photo.jpg' 
        ? `${API_URL}${user.profilePicture}` 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=8344AD&color=fff&size=128`;

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper function to calculate age
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return null;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex justify-center items-center p-3 sm:p-4 scrollbar-hide" onClick={onClose}>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-xl max-h-[90vh] overflow-y-auto relative animate-slideIn" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-10 text-gray-900 hover:text-gray-600 p-2 rounded-full bg-secondary hover:bg-gray-300 transition-all duration-200 hover:scale-110"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                {/* Header Section with Cover & Profile */}
                <div className="relative scrollbar-hide">
                    {/* Cover Background */}
                    <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-primary/90 via-primary/50 to-primary/90 rounded-t-xl sm:rounded-t-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className="absolute inset-0 opacity-30">
                            <div className="w-full h-full" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundRepeat: 'repeat'
                            }}></div>
                        </div>
                    </div>
                    
                    {/* Profile Picture */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 sm:-bottom-20 lg:-bottom-24">
                        <div className="relative">
                            <img 
                                src={profileImageUrl} 
                                alt={user.fullName} 
                                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-white shadow-2xl"
                            />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent"></div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-20 sm:pt-24 lg:pt-28 px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8 scrollbar-hide">
                    {/* Basic Info */}
                    <div className="text-center mb-6 lg:mb-8">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            {user.fullName}
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-base sm:text-lg lg:text-xl text-blue-600 font-semibold mb-4">
                            <AcademicCapIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                            Class of {user.batchYear}
                        </div>

                        {/* Social Media Links */}
                        {(user.linkedInProfile || user.facebookProfile || user.instagramProfile) && (
                            <div className="flex justify-center items-center gap-4 lg:gap-6 mb-6">
                                {user.linkedInProfile && (
                                    <a 
                                        href={user.linkedInProfile} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="group p-3 lg:p-4 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                    >
                                        <LinkedInIcon />
                                    </a>
                                )}
                                {user.facebookProfile && (
                                    <a 
                                        href={user.facebookProfile} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="group p-3 lg:p-4 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                    >
                                        <FacebookIcon />
                                    </a>
                                )}
                                {user.instagramProfile && (
                                    <a 
                                        href={user.instagramProfile} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="group p-3 lg:p-4 text-pink-600 hover:text-white bg-pink-50 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                    >
                                        <InstagramIcon />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Information Cards - Two column layout on large screens */}
                    <div className="space-y-6 lg:space-y-8">
                        {/* Bio Section */}
                        {user.bio && (
                            <div className="bg-gradient-to-r from-primary/20 to-primary/30 rounded-xl p-4 lg:p-6 border border-blue-100">
                                <div className="flex items-center gap-3 mb-3 lg:mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <ChatBubbleLeftRightIcon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                                    </div>
                                    <span className="font-semibold text-gray-900 text-lg lg:text-xl">About</span>
                                </div>
                                <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                                    {user.bio}
                                </p>
                            </div>
                        )}

                        {/* Contact & Professional Info - Two column layout on large screens */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                            {/* Email */}
                            <div className="group bg-white border border-gray-200 hover:border-blue-300 rounded-xl p-4 lg:p-6 transition-all duration-300 hover:shadow-md">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-50 group-hover:bg-blue-100 rounded-lg transition-colors">
                                        <EnvelopeIcon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm lg:text-base text-gray-500 font-medium mb-1">Email</p>
                                        <p className="font-semibold text-gray-900 text-base lg:text-lg break-all">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Current Organization */}
                            {user.currentOrganization && (
                                <div className="group bg-white border border-gray-200 hover:border-green-300 rounded-xl p-4 lg:p-6 transition-all duration-300 hover:shadow-md">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-green-50 group-hover:bg-green-100 rounded-lg transition-colors">
                                            <BuildingOfficeIcon className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm lg:text-base text-gray-500 font-medium mb-1">Current Organization</p>
                                            <p className="font-semibold text-gray-900 text-base lg:text-lg">
                                                {user.currentOrganization}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            {user.location && (
                                <div className="group bg-white border border-gray-200 hover:border-purple-300 rounded-xl p-4 lg:p-6 transition-all duration-300 hover:shadow-md">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-purple-50 group-hover:bg-purple-100 rounded-lg transition-colors">
                                            <MapPinIcon className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm lg:text-base text-gray-500 font-medium mb-1">Location</p>
                                            <p className="font-semibold text-gray-900 text-base lg:text-lg">
                                                {user.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Phone Number */}
                            {user.phoneNumber && (
                                <div className="group bg-white border border-gray-200 hover:border-orange-300 rounded-xl p-4 lg:p-6 transition-all duration-300 hover:shadow-md">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-orange-50 group-hover:bg-orange-100 rounded-lg transition-colors">
                                            <PhoneIcon className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm lg:text-base text-gray-500 font-medium mb-1">Phone</p>
                                            <p className="font-semibold text-gray-900 text-base lg:text-lg">
                                                {user.phoneNumber}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Date of Birth */}
                            {user.dateOfBirth && (
                                <div className="group bg-white border border-gray-200 hover:border-indigo-300 rounded-xl p-4 lg:p-6 transition-all duration-300 hover:shadow-md lg:col-span-2">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-indigo-50 group-hover:bg-indigo-100 rounded-lg transition-colors">
                                            <UserIcon className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm lg:text-base text-gray-500 font-medium mb-1">Date of Birth</p>
                                            <p className="font-semibold text-gray-900 text-base lg:text-lg">
                                                {formatDate(user.dateOfBirth)}
                                                {calculateAge(user.dateOfBirth) && (
                                                    <span className="text-gray-500 ml-2 font-normal">
                                                        ({calculateAge(user.dateOfBirth)} years old)
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes slideIn {
                    from { 
                        transform: translateY(30px) scale(0.9); 
                        opacity: 0; 
                    }
                    to { 
                        transform: translateY(0) scale(1); 
                        opacity: 1; 
                    }
                }
                .animate-slideIn { 
                    animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
                }
                
                @media (max-width: 640px) {
                    .animate-slideIn {
                        animation: slideIn 0.3s ease-out;
                    }
                }
            `}</style>
        </div>
    );
}

