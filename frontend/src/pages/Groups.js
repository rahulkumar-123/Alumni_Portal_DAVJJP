import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import groupService from '../services/groupService';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';
import { UsersIcon, ArrowRightIcon, PlusIcon } from '@heroicons/react/24/solid';
import useAuth from '../hooks/useAuth';
import CreateGroupModal from '../components/groups/CreateGroupModal';

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const { user } = useAuth();

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const res = await groupService.getGroups();
            setGroups(res.data.data);
        } catch (error) {
            toast.error("Could not fetch groups.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleJoinGroup = async (groupId) => {
        try {
            await groupService.joinGroup(groupId);
            toast.success("Successfully joined group!");
            fetchGroups();
        } catch (error) {
            toast.error("Failed to join group.");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-on-surface">Interest Groups</h1>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-transform transform hover:scale-105"
                >
                    <PlusIcon className="w-5 h-5" /> Create Group
                </button>
            </div>

            {groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groups.map(group => {
                        const isMember = group.members.some(member => member._id === user.id);
                        return (
                            <div key={group._id} className="bg-surface rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                                <div className="p-6 flex-grow">
                                    <h2 className="text-2xl font-bold text-on-surface">{group.name}</h2>
                                    <p className="text-muted mt-2 flex-grow">{group.description}</p>
                                </div>
                                <div className="bg-gray-50 p-4 flex justify-between items-center rounded-b-xl">
                                    <div className="flex items-center text-muted">
                                        <UsersIcon className="w-5 h-5 mr-2" />
                                        <span className="text-sm font-medium">{group.members.length} members</span>
                                    </div>
                                    {isMember ? (
                                        <Link to={`/groups/${group._id}`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-opacity-80 transition">
                                            Open Chat <ArrowRightIcon className="w-4 h-4 ml-2" />
                                        </Link>
                                    ) : (
                                        <button onClick={() => handleJoinGroup(group._id)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition">
                                            Join Group
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold text-on-surface">No Groups Found</h3>
                    <p className="text-muted mt-2">Be the first to create a group and start a new community!</p>
                </div>
            )}

            {isCreateModalOpen && <CreateGroupModal setIsOpen={setCreateModalOpen} onGroupCreated={fetchGroups} />}
        </div>
    );
}