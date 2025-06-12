import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import groupService from '../services/groupService';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';
import { UsersIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await groupService.getGroups();
                setGroups(res.data.data);
            } catch (error) {
                toast.error("Could not fetch groups.");
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-on-surface">Interest Groups</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map(group => (
                    <div key={group._id} className="bg-surface rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                        <div className="p-6 flex-grow">
                            <h2 className="text-2xl font-bold text-on-surface">{group.name}</h2>
                            <p className="text-muted mt-2 flex-grow">{group.description}</p>
                        </div>
                        <div className="bg-gray-50 p-4 flex justify-between items-center">
                            <div className="flex items-center text-muted">
                                <UsersIcon className="w-5 h-5 mr-2" />
                                <span className="text-sm">{group.members.length} members</span>
                            </div>
                            <Link to={`/groups/${group._id}`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
                                Open Chat <ArrowRightIcon className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
