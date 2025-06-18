import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        batchYear: '',
        admissionNumber: '',
        dateOfBirth: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            for (const key in formData) {
    if (!formData[key] && key !== 'admissionNumber') {
        toast.error(`Please fill out the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        setLoading(false);
        return;
    }
            }
            await authService.register(formData);
            toast.success('Registration successful! Please wait for admin approval.');
            navigate('/login');
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-surface rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-on-surface">Create Your Alumni Account</h2>
                    <p className="mt-2 text-center text-sm text-muted">
                        Already a member?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-primary-dark transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input name="fullName" placeholder="Full Name" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input name="password" type="password" placeholder="Password (min 6 characters)" required minLength="6" onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input name="batchYear" type="number" placeholder="Batch Year (e.g., 2015)" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input name="admissionNumber" type="text" placeholder="Admission Number (optional)" onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                    <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-muted mb-1">Date of Birth</label>
                        <input id="dateOfBirth" name="dateOfBirth" type="date" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:bg-primary-light transition duration-150 ease-in-out">
                            {loading ? 'Registering...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
