import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isForgotModalOpen, setForgotModalOpen] = useState(false);

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

    return (
        <>
            <div className="flex items-center justify-center py-12 sm:py-20 px-3 sm:px-4 min-h-[80vh]">
                <div className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 lg:p-10 bg-surface border border-white/5 rounded-2xl shadow-2xl relative">
                    {/* Decorative glow */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10">
                        <h2 className="mt-2 text-center text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: "'Fraunces', serif" }}>
                            Welcome back.
                        </h2>
                        <p className="mt-3 text-center text-sm text-muted">
                            New here?{' '}
                            <Link to="/register" className="font-medium text-primary hover:text-[#ffc14a] transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                    <form className="mt-8 space-y-5 relative z-10" onSubmit={handleSubmit}>
                        <div>
                            <input name="email" type="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm" />
                        </div>
                        <div>
                            <input name="password" type="password" placeholder="Password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm" />
                        </div>
                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <button type="button" onClick={() => setForgotModalOpen(true)} className="font-medium text-muted hover:text-white transition-colors">
                                    Forgot your password?
                                </button>
                            </div>
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-full text-black text-sm font-semibold shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-0.5
      ${loading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-[#ffc14a] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface'}`}
                            >
                                {loading ? 'Signing in...' : 'Sign In ↗'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
            {isForgotModalOpen && <ForgotPasswordModal onClose={() => setForgotModalOpen(false)} />}
        </>
    );
}