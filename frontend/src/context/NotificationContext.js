import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import { useSocket } from './SocketContext';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const socket = useSocket();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        if (user) {
            try {
                const res = await notificationService.getNotifications();
                setNotifications(res.data.data);
                setUnreadCount(res.data.data.filter(n => !n.read).length);
            } catch (error) { console.error("Failed to fetch notifications"); }
        }
    }, [user]);

    useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

    useEffect(() => {
        if (socket) {
            socket.on('new_notification', (newNotification) => {
                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);
            });
            return () => socket.off('new_notification');
        }
    }, [socket]);

    const markAllAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            await notificationService.markAsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) { console.error("Failed to mark notifications as read"); }
    };

    const value = { notifications, unreadCount, markAllAsRead, refreshNotifications: fetchNotifications };
    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

