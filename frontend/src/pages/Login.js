import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import authService from '../services/authService';
import toast from 'react-hot-toast';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authService.login(formData);
            login(res.data.token);
            toast.success('Logged in successfully!');
            navigate('/');
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);
            setLoading(false);
        }
    };

    return (<div className="flex items-center justify-center py-12 px-4"><div className="max-w-md w-full space-y-8 p-10 bg-surface rounded-xl shadow-lg">
        <div><h2 className="mt-6 text-center text-3xl font-extrabold text-on-surface">Sign in to your account</h2><p className="mt-2 text-center text-sm text-muted">Or{' '}<Link to="/register" className="font-medium text-primary hover:text-primary-dark">register for a new account</Link></p></div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
            <input name="password" type="password" placeholder="Password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
            <div><button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark disabled:bg-primary-light transition duration-150 ease-in-out">{loading ? 'Signing in...' : 'Sign in'}</button></div>
        </form>
    </div></div>);
}
