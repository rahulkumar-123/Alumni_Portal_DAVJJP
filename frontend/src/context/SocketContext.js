import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import useAuth from '../hooks/useAuth';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

// Connect to the backend server URL
const SOCKET_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        // Only establish a connection if the user is logged in
        if (user) {
            const newSocket = io(SOCKET_URL);
            setSocket(newSocket);

            return () => newSocket.close();
        } else {
            // If there is no user, close any existing socket connection
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
