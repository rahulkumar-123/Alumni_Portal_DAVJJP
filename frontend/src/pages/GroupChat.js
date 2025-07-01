import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import messageService from '../services/messageService';
import groupService from '../services/groupService';
import useAuth from '../hooks/useAuth';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';
import { PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import NotMemberModal from '../components/groups/NotMemberModal';
import { MentionsInput, Mention } from 'react-mentions';
import userService from '../services/userService';

const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export default function GroupChat() {
    const { id: groupId } = useParams();
    const { user: authUser } = useAuth();
    const socket = useSocket();

    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const [isGroupMember, setIsGroupMember] = useState(false);
    const [isNotMemberModalOpen, setNotMemberModalOpen] = useState(false);

    const CloseNotMemberModal = () => {
        setNotMemberModalOpen(false);
        window.location.href = '/groups';
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Effect for fetching initial data
    useEffect(() => {
        const fetchGroupData = async () => {
            setLoading(true);
            try {
                const [groupRes, messagesRes] = await Promise.all([
                    groupService.getGroupDetails(groupId),
                    messageService.getMessages(groupId),
                ]);
                setGroup(groupRes.data.data);
                setMessages(messagesRes.data.data);
            } catch (error) {
                toast.error("Failed to load chat data.");
                console.error(error);
                setNotMemberModalOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchGroupData();
    }, [groupId]);

    // Effect for handling socket events
    useEffect(() => {
        if (socket) {
            socket.emit('join_group', groupId);
            const messageListener = (receivedMessage) => {
                if (receivedMessage.group === groupId) {
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                }
            };
            socket.on('receive_message', messageListener);
            return () => {
                socket.off('receive_message', messageListener);
            };
        }
    }, [socket, groupId]);

    useEffect(() => {
        const checkGroupMembership = async () => {
            try {
                const res = await groupService.isGroupMember(groupId);
                setIsGroupMember(res.data.isMember);
                setNotMemberModalOpen(true);
            } catch (error) {
                console.error("Error checking group membership:", error);
                setIsGroupMember(false);
            }
        }
        checkGroupMembership();
    }, [groupId]);


    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!socket || !socket.connected) {
            toast.error("You are not connected to the chat. Please refresh and try again.");
            return;
        }
        if (!newMessage.trim() || !authUser) {
            return;
        }

        socket.emit('send_message', {
            groupId,
            senderId: authUser._id,
            text: newMessage,
        });

        setNewMessage('');
    };

    const fetchUsersForMention = (query, callback) => {
        if (!query) return;
        userService.searchUsers(query)
            .then(res => callback(res.data.data))
            .catch(() => callback([]));
    };

    if (loading) return <Spinner />;

    if (!group) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-muted">Group not found.</h2>
            <Link to="/groups" className="mt-4 inline-block text-primary hover:underline">
                &larr; Back to all groups
            </Link>
        </div>
    );

    if (!isGroupMember && !loading) {
        return (
            <NotMemberModal
                isOpen={isNotMemberModalOpen}
                onClose={CloseNotMemberModal}
            />
        );
    }

    return (
        <div className="h-[75vh] flex flex-col bg-surface rounded-2xl shadow-2xl">
            <style>{`
                .mentions { width: 100%; }
                .mentions__control { background-color: white; border-radius: 9999px; padding: 0.75rem 1rem; border: 1px solid #d1d5db; }
                .mentions__input { padding: 0; border: 0; outline: 0; font-size: 1rem; }
                .mentions__suggestions__list { background-color: white; border: 1px solid #d1d5db; border-radius: 0.5rem; margin-top: 0.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
                .mentions__suggestions__item { padding: 0.5rem 1rem; }
                .mentions__suggestions__item--focused { background-color: #f3f4f6; }
                .mentions__mention { background-color: #e0d4ec; padding: 2px 1px; border-radius: 4px; }
            `}</style>
            <div className="p-4 border-b flex items-center space-x-4 sticky top-0 bg-surface rounded-t-2xl">
                <Link to="/groups" className="text-primary hover:text-primary-dark p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-on-surface">{group.name}</h1>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                {messages.length > 0 ? (
                    messages.map(msg => {
                        const isMyMessage = msg.sender?._id === authUser?._id;
                        const profileImageUrl = msg.sender?.profilePicture?.startsWith('http')
                            ? msg.sender.profilePicture
                            : msg.sender?.profilePicture && msg.sender.profilePicture !== 'no-photo.jpg'
                                ? `${API_URL}${msg.sender.profilePicture}`
                                : `https://ui-avatars.com/api/?name=${msg.sender?.fullName}&background=8344AD&color=fff`;

                        return (
                            <div key={msg._id} className={`flex my-2 items-end gap-2 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                {/* Profile Picture for other users */}
                                {!isMyMessage && (
                                    <img src={profileImageUrl} alt={msg.sender?.fullName} className="w-8 h-8 rounded-full object-cover self-start" />
                                )}

                                <div className={`p-3 rounded-2xl max-w-lg ${isMyMessage ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-on-surface rounded-bl-none'}`}>
                                    {/* Sender's Name and Batch */}
                                    {!isMyMessage && (
                                        <p className="font-bold text-xs mb-1 text-primary-dark">
                                            {msg.sender?.fullName}
                                        </p>
                                    )}
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-muted py-10">
                        <p>No messages yet.</p>
                        <p className="text-sm">Be the first to start the conversation!</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <MentionsInput
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message... use @ to mention someone."
                        className="mentions"
                        a11ySuggestionsListLabel={"Suggested users for mention"}
                    >
                        <Mention
                            trigger="@"
                            data={fetchUsersForMention}
                            markup="@[__display__](__id__)" 
                            displayTransform={(id, display) => `@${display}`}
                            className="mentions__mention"
                        />
                    </MentionsInput>
                    <button type="submit" className="p-3 bg-primary rounded-full text-white hover:bg-primary-dark transition-colors disabled:opacity-50" disabled={!newMessage.trim()}>
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
}
