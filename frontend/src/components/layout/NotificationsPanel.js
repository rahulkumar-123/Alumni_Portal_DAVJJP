import React, { useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import notificationService from '../../services/notificationService';

const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export default function NotificationsPanel({ onClose }) {
    const { notifications, unreadCount, markAllAsRead, refreshNotifications } = useNotifications();
    const navigate = useNavigate();

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
        switch (n.type) {
            case 'new_like': content = `liked your post: "${n.post?.title}"`; break;
            case 'new_comment': content = `commented on your post: "${n.post?.title}"`; break;
            case 'new_post': content = `created a new post: "${n.post?.title}"`; break;
            case 'mention_comment': content = `mentioned you in a comment on "${n.post?.title}"`; break;
            case 'mention_chat': content = `mentioned you in the group: "${n.group?.name}"`; break;
            default: content = "sent you a new notification.";
        }
        return <><strong>{n.sender.fullName}</strong> {content}</>;
    };

    return (
        <div className="absolute right-0 z-20 mt-2 w-80 sm:w-96 origin-top-right rounded-md bg-surface shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="p-2">
                <div className="flex justify-between items-center p-2">
                    <h3 className="font-bold text-lg text-on-surface">Notifications</h3>
                    <Link to="/notifications" onClick={onClose} className="text-sm text-primary hover:underline">View All</Link>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => {
                        const profileImageUrl = n.sender.profilePicture?.startsWith('http')
                            ? n.sender.profilePicture
                            : n.sender.profilePicture && n.sender.profilePicture !== 'no-photo.jpg'
                                ? `${API_URL}${n.sender.profilePicture}`
                                : `https://ui-avatars.com/api/?name=${n.sender.fullName}&background=8344AD&color=fff`;

                        return (
                            <div key={n._id} onClick={() => handleNotificationClick(n)} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${!n.read ? 'bg-primary-light/10' : ''}`}>
                                <img src={profileImageUrl} alt={n.sender.fullName} className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-1">
                                    <p className="text-sm text-on-surface">{getNotificationText(n)}</p>
                                    <p className="text-xs text-muted mt-1">{formatDistanceToNow(new Date(n.createdAt))} ago</p>
                                </div>
                            </div>
                        )
                    }) : <p className="p-4 text-center text-muted">No new notifications.</p>}
                </div>
            </div>
        </div>
    );
}
