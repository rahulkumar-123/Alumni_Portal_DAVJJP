import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';

export default function PendingUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingUsers = async () => {
        try {
            const res = await userService.getPendingUsers();
            setUsers(res.data.data);
        } catch (error) {
            toast.error("Failed to fetch pending users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleApprove = async (id) => {
        try {
            await userService.approveUser(id);
            toast.success("User approved!");
            fetchPendingUsers();
        } catch (error) {
            toast.error("Failed to approve user.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await userService.deleteUser(id);
            toast.success("User rejected and deleted!");
            fetchPendingUsers();
        } catch (error) {
            toast.error("Failed to delete user.");
        }
    };


    if (loading) return <Spinner />;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                {users.length > 0 ? users.map((user) => (
                    <li key={user.email}>
                        <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-brand-blue truncate">{user.fullName}</p>
                                <div className="ml-2 flex-shrink-0 flex space-x-2">
                                    <button onClick={() => handleApprove(user._id)} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approve</button>
                                    <button onClick={() => handleDelete(user._id)} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Reject</button>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">{user.email}</p>
                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">Batch: {user.batchYear}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                )) : <p className="p-4 text-gray-500">No pending registrations.</p>}
            </ul>
        </div>
    );
}
