import React, { Fragment, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import authService from '../../services/authService';

function classNames(...classes) { return classes.filter(Boolean).join(' '); }
const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (user) {
            authService.getMe().then(res => setCurrentUser(res.data.data)).catch(() => {
                logout();
            });
        } else {
            setCurrentUser(null);
        }
    }, [user, logout]);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const baseNav = [
        { name: 'Home', href: '/' },
        { name: 'Groups', href: '/groups' },
        { name: 'Directory', href: '/directory' },
        { name: 'Feedback', href: '/feedback' },
    ];
    if (currentUser?.role === 'admin') {
        baseNav.push({ name: 'Admin', href: '/admin' });
    }
    const navigation = user ? baseNav : [{ name: 'Home', href: '/' }];

    return (
        <Disclosure as="nav" className="bg-surface/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex flex-shrink-0 items-center">
                                    <Link to="/" className="text-2xl font-extrabold text-primary flex items-center">
                                        <SparklesIcon className="w-6 h-6 mr-2 text-secondary" />
                                        MNJ DAV Alumni
                                    </Link>
                                </div>
                                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                    {navigation.map((item) => (
                                        <NavLink key={item.name} to={item.href} className={({ isActive }) => classNames(isActive ? 'border-primary text-on-surface' : 'border-transparent text-muted hover:text-on-surface hover:border-gray-300', 'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-semibold transition-colors')}>
                                            {item.name}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                {user && currentUser ? (
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                                <span className="sr-only">Open user menu</span>
                                                <img className="h-9 w-9 rounded-full object-cover" src={currentUser.profilePicture?.startsWith('http') ? currentUser.profilePicture : currentUser.profilePicture !== 'no-photo.jpg' ? `${API_URL}${currentUser.profilePicture}` : `https://ui-avatars.com/api/?name=${currentUser.fullName}&background=8344AD&color=fff`} alt={currentUser.fullName} />
                                            </Menu.Button>
                                        </div>
                                        <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-surface py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>{({ active }) => (<Link to="/profile" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-muted')}>Your Profile</Link>)}</Menu.Item>
                                                <Menu.Item>{({ active }) => (<button onClick={handleLogout} className={classNames(active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-muted')}>Sign out</button>)}</Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                ) : (
                                    <div className="space-x-2 flex items-center">
                                        <Link to="/login" className="text-sm font-semibold text-muted hover:text-primary transition-colors px-4 py-2">
                                            Sign In
                                        </Link>
                                        <Link to="/register" className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-transform transform hover:scale-105">
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className="-mr-2 flex items-center sm:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-surface p-2 text-muted hover:bg-gray-100 hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (<XMarkIcon className="block h-6 w-6" aria-hidden="true" />) : (<Bars3Icon className="block h-6 w-6" aria-hidden="true" />)}
                                </Disclosure.Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    );
}