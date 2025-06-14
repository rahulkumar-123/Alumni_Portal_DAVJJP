import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import useAuth from '../hooks/useAuth';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Updated connection options for production robustness
            const newSocket = io(SOCKET_URL, {
                transports: ['websocket'], // Force WebSocket connection
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });
            setSocket(newSocket);

            newSocket.on('connect', () => console.log('%cSocket Connected!', 'color: green; font-weight: bold;'));
            newSocket.on('disconnect', () => console.log('%cSocket Disconnected.', 'color: orange; font-weight: bold;'));
            newSocket.on('connect_error', (err) => console.error('Socket Connection Error:', err));

            return () => newSocket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </Socket.Provider>
    );
};
