import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import Spinner from '../components/common/Spinner';

export default function AlumniDirectory() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        batch: '',
        company: '',
        location: ''
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.batch) params.batchYear = filters.batch;
            if (filters.company) params.currentOrganization = filters.company;
            if (filters.location) params.location = filters.location;

            const res = await userService.getAlumniDirectory(params);
            setUsers(res.data.data);
        } catch (error) {
            console.error("Failed to fetch alumni directory:", error);
        } finally {
            setLoading(false);
        }
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

            <form onSubmit={handleFilterSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <input name="batch" placeholder="Filter by Batch Year" onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                <input name="company" placeholder="Filter by Company" onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                <input name="location" placeholder="Filter by Location" onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                <button type="submit" className="bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-800 w-full">Filter</button>
            </form>

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map(user => (
                        <div key={user._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <img className="h-20 w-20 rounded-full mx-auto mb-4" src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`} alt={user.fullName} />
                            <h3 className="text-xl font-bold text-center">{user.fullName}</h3>
                            <p className="text-center text-gray-500">Batch of {user.batchYear}</p>
                            <div className="mt-4 text-sm text-gray-600 space-y-1">
                                <p><strong>Department:</strong> {user.department}</p>
                                <p><strong>Company:</strong> {user.currentOrganization || 'N/A'}</p>
                                <p><strong>Location:</strong> {user.location || 'N/A'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
