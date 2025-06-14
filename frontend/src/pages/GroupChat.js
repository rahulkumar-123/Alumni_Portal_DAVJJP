
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import messageService from '../services/messageService';
import groupService from '../services/groupService';
import useAuth from '../hooks/useAuth';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';
import { PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function GroupChat() {
    const { id: groupId } = useParams();
    const { user: authUser } = useAuth();
    const socket = useSocket();
    
    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

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
                    messageService.getMessages(groupId)
                ]);
                setGroup(groupRes.data.data);
                setMessages(messagesRes.data.data);
            } catch (error) {
                toast.error("Failed to load chat data.");
                console.error(error);
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

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !authUser) return;
        
        socket.emit('send_message', {
            groupId,
            senderId: authUser._id, // Ensure we use the full user object's ID
            text: newMessage,
        });
        setNewMessage('');
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

    return (
        <div className="h-[75vh] flex flex-col bg-surface rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b flex items-center space-x-4 sticky top-0 bg-surface rounded-t-2xl">
                <Link to="/groups" className="text-primary hover:text-primary-dark p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="w-6 h-6"/>
                </Link>
                <h1 className="text-2xl font-bold text-on-surface">{group.name}</h1>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto">
                {messages.length > 0 ? (
                    messages.map(msg => (
                        <div key={msg._id} className={`flex my-2 items-end gap-2 ${msg.sender?._id === authUser._id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-2xl max-w-lg ${msg.sender?._id === authUser._id ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-on-surface rounded-bl-none'}`}>
                               {msg.sender?._id !== authUser._id && (
                                   <p className="font-bold text-xs mb-1 text-primary-dark">{msg.sender.fullName}</p>
                               )}
                               <p>{msg.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted py-10">
                        <p>No messages yet.</p>
                        <p className="text-sm">Be the first to start the conversation!</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button type="submit" className="p-3 bg-primary rounded-full text-white hover:bg-primary-dark transition-colors disabled:opacity-50" disabled={!newMessage.trim()}>
                        <PaperAirplaneIcon className="w-6 h-6"/>
                    </button>
                </form>
            </div>
        </div>
    );
}
