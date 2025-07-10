import React, { useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import notificationService from '../../services/notificationService';
import { 
    BellIcon, 
    EyeIcon, 
    ChatBubbleLeftIcon, 
    HeartIcon, 
    UserPlusIcon,
    DocumentTextIcon,
    UserGroupIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export default function NotificationsPanel({ onClose }) {
    const { notifications, unreadCount, markAllAsRead, refreshNotifications } = useNotifications();
    const navigate = useNavigate();
    const panelRef = useRef(null);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    useEffect(() => {
        if (unreadCount > 0) {
            const timer = setTimeout(() => {
                markAllAsRead();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [unreadCount, markAllAsRead]);

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            try {
                await notificationService.markOneAsRead(notification._id);
                refreshNotifications();
            } catch (error) { console.error("Failed to mark notification as read"); }
        }
        onClose();
        if (notification.post) {
            navigate(`/posts/${notification.post._id}`);
        } else if (notification.group) {
            navigate(`/groups/${notification.group._id}`);
        }
    };

    const getNotificationText = (n) => {
        let content = '';
        const postTitle = n.post?.title || 'a post';
        const groupName = n.group?.name || 'a group';
        
        switch (n.type) {
            case 'new_like': 
                content = `liked your post`;
                break;
            case 'new_comment': 
                content = `commented on your post`;
                break;
            case 'new_post': 
                content = `created a new post`;
                break;
            case 'mention_comment': 
                content = `mentioned you in a comment`;
                break;
            case 'mention_chat': 
                content = `mentioned you in ${groupName}`;
                break;
            default: 
                content = "sent you a new notification";
                break;
        }
        
        return (
            <div className="space-y-1">
                <div className="flex flex-wrap items-baseline gap-1">
                    <strong className="font-semibold text-gray-900 text-sm">
                        {n.sender.fullName}
                    </strong>
                    <span className="text-gray-600 text-sm">
                        {content}
                    </span>
                </div>
                {(n.post?.title || n.group?.name) && (
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md truncate">
                        "{n.post?.title || n.group?.name}"
                    </div>
                )}
            </div>
        );
    };

    const getNotificationIcon = (type) => {
        const iconClass = "w-4 h-4";
        switch (type) {
            case 'new_like': return <HeartIcon className={`${iconClass} text-red-500`} />;
            case 'new_comment': return <ChatBubbleLeftIcon className={`${iconClass} text-blue-500`} />;
            case 'new_post': return <DocumentTextIcon className={`${iconClass} text-green-500`} />;
            case 'mention_comment': return <ChatBubbleLeftIcon className={`${iconClass} text-purple-500`} />;
            case 'mention_chat': return <UserGroupIcon className={`${iconClass} text-indigo-500`} />;
            default: return <BellIcon className={`${iconClass} text-gray-500`} />;
        }
    };

    return (
        <div 
            ref={panelRef}
            className="absolute z-20 mt-2 w-80 sm:w-96 origin-top-right rounded-xl bg-white shadow-2xl border border-gray-100 focus:outline-none overflow-hidden animate-in slide-in-from-top-2 duration-200"
            style={{
                right: '-100%',
                top: '100%'
            }}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/50 to-primary/60 p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <BellIcon className="w-5 h-5 text-white" />
                        <h3 className="font-bold text-lg text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <Link 
                        to="/notifications" 
                        onClick={onClose} 
                        className="text-white/90 hover:text-white text-sm font-medium hover:underline transition-colors duration-200"
                    >
                        View All
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {notifications.map(n => {
                            const profileImageUrl = n.sender.profilePicture?.startsWith('http')
                                ? n.sender.profilePicture
                                : n.sender.profilePicture && n.sender.profilePicture !== 'no-photo.jpg'
                                    ? `${API_URL}${n.sender.profilePicture}`
                                    : `https://ui-avatars.com/api/?name=${n.sender.fullName}&background=8344AD&color=fff`;

                            return (
                                <div 
                                    key={n._id} 
                                    onClick={() => handleNotificationClick(n)} 
                                    className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                                        !n.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                    }`}
                                >
                                    {/* Profile Image */}
                                    <div className="relative flex-shrink-0">
                                        <img 
                                            src={profileImageUrl} 
                                            alt={n.sender.fullName} 
                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" 
                                            loading="lazy"
                                        />
                                        {/* Notification Type Icon */}
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-lg">
                                            {getNotificationIcon(n.type)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                {getNotificationText(n)}
                                            </div>
                                            {!n.read && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-gray-500">
                                                {formatDistanceToNow(new Date(n.createdAt))} ago
                                            </p>
                                            {n.read && (
                                                <CheckCircleIcon className="w-3 h-3 text-green-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No new notifications</p>
                        <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && unreadCount > 0 && (
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={() => {
                            markAllAsRead();
                            setTimeout(onClose, 500);
                        }}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 py-1"
                    >
                        Mark all as read
                    </button>
                </div>
            )}
        </div>
    );
}
