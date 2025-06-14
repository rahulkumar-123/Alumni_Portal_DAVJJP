import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import Spinner from '../components/common/Spinner';
import AlumniDetailModal from '../components/directory/AlumniDetailModal';
import toast from 'react-hot-toast';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export default function AlumniDirectory() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ batchYear: '', currentOrganization: '', location: '' });
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async (page) => {
        setLoading(true);
        try {
            const activeFilters = { page, ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== '')) };
            const res = await userService.getAlumniDirectory(activeFilters);
            setUsers(res.data.data);
            setPagination(res.data.pagination);
        } catch (error) {
            toast.error("Could not fetch alumni.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchUsers(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setCurrentPage(newPage);
        }
    };
    const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-on-surface">Alumni Directory</h1>
                <p className="mt-2 text-lg text-muted max-w-2xl mx-auto">Find old friends and make new connections. The directory is private and only visible to approved alumni members.</p>
            </div>

            <form onSubmit={handleFilterSubmit} className="bg-surface p-6 rounded-xl shadow-lg mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <input name="batchYear" type="number" placeholder="Filter by Batch Year" value={filters.batchYear} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                <input name="currentOrganization" placeholder="Filter by Company/Institute" value={filters.currentOrganization} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                <input name="location" placeholder="Filter by Location" value={filters.location} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors">Filter</button>
            </form>

            {loading ? <Spinner /> : (
                users.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {users.map(user => {
                            const profileImageUrl = user.profilePicture?.startsWith('http') ? user.profilePicture : user.profilePicture && user.profilePicture !== 'no-photo.jpg' ? `${API_URL}${user.profilePicture}` : `https://ui-avatars.com/api/?name=${user.fullName}&background=8344AD&color=fff`;
                            return (
                                <div key={user._id} className="bg-surface p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => setSelectedUser(user)}>
                                    <img className="h-24 w-24 rounded-full mx-auto mb-4 object-cover" src={profileImageUrl} alt={user.fullName} />
                                    <h3 className="text-xl font-bold text-center text-on-surface">{user.fullName}</h3>
                                    <p className="text-center text-primary font-semibold">Batch of {user.batchYear}</p>
                                    <div className="mt-4 text-sm text-center text-muted">
                                        <p>{user.currentOrganization || 'Not provided'}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-surface rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold text-on-surface">No Alumni Found</h3>
                        <p className="text-muted mt-2">No results match your current filters.</p>
                    </div>
                )
            )}

            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md bg-surface shadow-md disabled:opacity-50 transition">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-muted">Page {pagination.currentPage} of {pagination.totalPages}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pagination.totalPages} className="p-2 rounded-md bg-surface shadow-md disabled:opacity-50 transition">
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            )}

            {selectedUser && <AlumniDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    );
}
