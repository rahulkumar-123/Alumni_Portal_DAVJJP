import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';
import { format } from 'date-fns';

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
        <div className="bg-surface shadow overflow-hidden sm:rounded-xl">
            <ul className="divide-y divide-gray-200">
                {users.length > 0 ? users.map((user) => (
                    <li key={user.email}>
                        <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-primary truncate">{user.fullName}</p>
                                <div className="ml-2 flex-shrink-0 flex space-x-2">
                                    <button onClick={() => handleApprove(user._id)} className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 hover:bg-green-200">Approve</button>
                                    <button onClick={() => handleDelete(user._id)} className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 hover:bg-red-200">Reject</button>
                                </div>
                            </div>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-sm text-muted">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Batch:</strong> {user.batchYear}</p>
                                <p><strong>Admission No:</strong> {user.admissionNumber}</p>
                                <p><strong>DOB:</strong> {format(new Date(user.dateOfBirth), 'dd MMM yyyy')}</p>
                            </div>
                        </div>
                    </li>
                )) : <p className="p-4 text-muted">No pending registrations.</p>}
            </ul>
        </div>
    );
}
