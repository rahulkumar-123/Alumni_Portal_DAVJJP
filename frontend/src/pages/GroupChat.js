import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import messageService from '../services/messageService';
import groupService from '../services/groupService';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';
import { PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function GroupChat() {
    const { id: groupId } = useParams();
    const { user: authUser } = useAuth();
    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const [groupRes, messagesRes] = await Promise.all([
                    groupService.getGroupDetails(groupId),
                    messageService.getMessages(groupId)
                ]);
                setGroup(groupRes.data.data);
                setMessages(messagesRes.data.data);
            } catch (error) {
                toast.error("Failed to load chat.");
            } finally {
                setLoading(false);
            }
        };
        fetchGroupData();
    }, [groupId]);

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await messageService.postMessage(groupId, { text: newMessage });
            setMessages([...messages, res.data.data]);
            setNewMessage('');
        } catch (error) {
            toast.error("Couldn't send message.");
        }
    };

    if (loading) return <Spinner />;
    if (!group) return <p>Group not found.</p>;

    return (
        <div className="h-[75vh] flex flex-col bg-surface rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b flex items-center space-x-4">
                <Link to="/groups" className="text-primary hover:text-primary-dark"><ArrowLeftIcon className="w-6 h-6" /></Link>
                <h1 className="text-2xl font-bold">{group.name}</h1>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto">
                {messages.map(msg => (
                    <div key={msg._id} className={`flex my-2 ${msg.sender._id === authUser.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-lg ${msg.sender._id === authUser.id ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                            <p className="font-bold text-xs mb-1">{msg.sender.fullName}</p>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button type="submit" className="p-3 bg-primary rounded-full text-white hover:bg-primary-dark transition-colors">
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
}
