import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AlumniDirectory from './pages/AlumniDirectory';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Feedback from './pages/Feedback';
import Groups from './pages/Groups';
import GroupChat from './pages/GroupChat';
import NotFound from './pages/NotFound';

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <Router>
                    <div className="flex flex-col min-h-screen bg-background">
                        <Navbar />
                        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                <Route path="/directory" element={<PrivateRoute><AlumniDirectory /></PrivateRoute>} />
                                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                                <Route path="/feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />
                                <Route path="/groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
                                <Route path="/groups/:id" element={<PrivateRoute><GroupChat /></PrivateRoute>} />
                                <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />

                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                    <Toaster position="bottom-right" toastOptions={{
                        className: 'bg-on-surface text-white rounded-lg shadow-lg',
                        duration: 4000,
                    }} />
                </Router>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;
