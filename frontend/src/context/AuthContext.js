import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwt_decode(token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp > currentTime) {
                    setUser(decoded);
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } else {
                    // Token expired
                    logout();
                }
            } catch (error) {
                console.error("Invalid token", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwt_decode(token);
        setUser(decoded);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
