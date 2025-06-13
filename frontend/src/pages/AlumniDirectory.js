import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import Spinner from '../components/common/Spinner';
import AlumniDetailModal from '../components/directory/AlumniDetailModal';

export default function AlumniDirectory() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        batchYear: '',
        currentOrganization: '',
        location: ''
    });
    // --New State for Modal---
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Pass only non-empty filters to the service
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '')
            );
            const res = await userService.getAlumniDirectory(activeFilters);
            setUsers(res.data.data);
        } catch (error) { /* ... */ } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchUsers();
    };


    return (
        <div>
            <h1 className="text-4xl font-extrabold text-on-surface mb-6">Alumni Directory</h1>
            <p className="mt-2 text-lg text-muted max-w-2xl mx-auto">Find old friends and make new connections. The directory is private and only visible to approved alumni members.</p>

            <form onSubmit={handleFilterSubmit} className="bg-surface p-6 rounded-xl shadow-lg mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <input name="batchYear" type="number" placeholder="Filter by Batch Year" value={filters.batchYear} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                <input name="currentOrganization" placeholder="Filter by Company/Institute" value={filters.currentOrganization} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                <input name="location" placeholder="Filter by Location" value={filters.location} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors">Filter</button>
            </form>

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {users.map(user => {
                        const profileImageUrl = user.profilePicture?.startsWith('http') ? user.profilePicture : user.profilePicture && user.profilePicture !== 'no-photo.jpg' ? `${API_URL}${user.profilePicture}` : `https://ui-avatars.com/api/?name=${user.fullName}&background=8344AD&color=fff`;
                        return (
                            // --- CARD IS NOW CLICKABLE ---
                            <div key={user._id}
                                className="bg-surface p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                onClick={() => setSelectedUser(user)}
                            >
                                <img className="h-24 w-24 rounded-full mx-auto mb-4 object-cover" src={profileImageUrl} alt={user.fullName} />
                                <h3 className="text-xl font-bold text-center text-on-surface">{user.fullName}</h3>
                                <p className="text-center text-primary font-semibold">Batch of {user.batchYear}</p>
                                <div className="mt-4 text-sm text-center text-muted">
                                    <p>{user.currentOrganization || 'N/A'}</p>
                                    <p><strong>Location:</strong> {user.location || 'N/A'}</p>
                                    
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            {selectedUser && <AlumniDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    );
}
