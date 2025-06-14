import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import useAuth from '../hooks/useAuth';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

let SOCKET_URL;
if (process.env.NODE_ENV === 'production') {
    // In production, derive the URL from the REACT_APP_API_URL env variable
    SOCKET_URL = process.env.REACT_APP_API_URL.replace("/api", "");
} else {
    // For local development, use localhost
    SOCKET_URL = "http://localhost:5000";
}

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const newSocket = io(SOCKET_URL);
            setSocket(newSocket);
            console.log(`Attempting to connect socket to: ${SOCKET_URL}`);

            newSocket.on('connect_error', (err) => {
                console.error('Socket connection error:', err.message);
            });

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
        </SocketContext.Provider>
    );
};
