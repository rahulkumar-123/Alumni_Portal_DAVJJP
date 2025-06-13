import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import api from '../services/api';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            authService.getMe()
                .then(res => {
                    setUser(res.data.data);
                    if (res.data.data.role === 'admin') {
                        setIsAdmin(true);
                    }
                })
                .catch(() => {
                    // Token is invalid, log out
                    logout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return authService.getMe().then(res => {
            setUser(res.data.data);
            if (res.data.data.role === 'admin') {
                setIsAdmin(true);
            }
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAdmin(false);
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
