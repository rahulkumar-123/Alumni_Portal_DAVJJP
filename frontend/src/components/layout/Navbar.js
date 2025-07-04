import React, { Fragment, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, SparklesIcon, BellIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useNotifications } from '../../context/NotificationContext';
import NotificationsPanel from './NotificationsPanel';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const API_URL = (process.env.REACT_APP_API_URL || '').replace("/api", "");

export default function Navbar() {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { unreadCount } = useNotifications();
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const handleNavClick = (e, hash) => {
        e.preventDefault();
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const loggedInNavigation = [
        { name: 'Home', href: '/' },
        { name: 'Groups', href: '/groups' },
        { name: 'Directory', href: '/directory' },
        { name: 'Feedback', href: '/feedback' },
        ...(isAdmin ? [{ name: 'Admin', href: '/admin' }] : [])
    ];

    const guestNavigation = [
        { name: 'About', href: '#about', onClick: (e) => handleNavClick(e, '#about') },
        { name: 'Alumni', href: '#notable-alumni', onClick: (e) => handleNavClick(e, '#notable-alumni') },
        { name: 'Developer', href: '#developer', onClick: (e) => handleNavClick(e, '#developer') },
        { name: 'Privacy Policy', href: '/privacy-policy' },
    ];

    const navigation = user ? loggedInNavigation : guestNavigation;

    return (
        <Disclosure as="nav" className="bg-surface/80 backdrop-blur-sm shadow-md sticky top-0 z-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {({ open, close }) => (
                <>
                    <div className="mx-auto max-w-7xl">
                        <div className="flex h-16 justify-between">
                            {/* Left Section */}
                            <div className="flex">
                                <Link to="/" className="text-2xl font-extrabold text-primary flex items-center">
                                    <SparklesIcon className="w-6 h-6 mr-2 text-secondary" />
                                    MNJ DAV Alumni
                                </Link>
                                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                    {navigation.map((item) => (
                                        item.onClick ? (
                                            <a key={item.name} href={item.href} onClick={(e) => item.onClick(e, item.href)}
                                                className="border-transparent text-muted hover:text-on-surface hover:border-gray-300 inline-flex items-center border-b-2 px-1 pt-1 text-sm font-semibold transition-colors">
                                                {item.name}
                                            </a>
                                        ) : (
                                            <NavLink key={item.name} to={item.href}
                                                className={({ isActive }) =>
                                                    classNames(isActive ? 'border-primary text-on-surface' : 'border-transparent text-muted hover:text-on-surface hover:border-gray-300',
                                                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-semibold transition-colors')}
                                            >
                                                {item.name}
                                            </NavLink>
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                {user ? (
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <button onClick={() => setNotificationsOpen(!isNotificationsOpen)} className="p-2 rounded-full text-muted hover:text-on-surface hover:bg-gray-100 transition-colors">
                                                <span className="sr-only">View notifications</span>
                                                <BellIcon className="h-6 w-6" />
                                                {unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                                        {unreadCount > 9 ? '9+' : unreadCount}
                                                    </span>
                                                )}
                                            </button>
                                            {isNotificationsOpen && <NotificationsPanel onClose={() => setNotificationsOpen(false)} />}
                                        </div>
                                        <Menu as="div" className="relative">
                                            <div>
                                                <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                                    <span className="sr-only">Open user menu</span>
                                                    <img className="h-9 w-9 rounded-full object-cover"
                                                        src={user.profilePicture?.startsWith('http') ? user.profilePicture :
                                                            user.profilePicture !== 'no-photo.jpg' ? `${API_URL}${user.profilePicture}` :
                                                                `https://ui-avatars.com/api/?name=${user.fullName}&background=8344AD&color=fff`}
                                                        alt={user.fullName} />
                                                </Menu.Button>
                                            </div>
                                            <Transition as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95">
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-surface py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link to="/profile" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-muted')}>
                                                                Your Profile
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button onClick={handleLogout}
                                                                className={classNames(active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-muted')}>
                                                                Sign out
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                ) : (
                                    <div className="space-x-2 flex items-center">
                                        <Link to="/login" className="text-sm font-semibold text-muted hover:text-primary transition-colors px-4 py-2">Sign In</Link>
                                        <Link to="/register" className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary-dark">Register</Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="-mr-2 flex items-center sm:hidden">
                                {user && (
                                    <div className="relative">
                                        <button onClick={() => setNotificationsOpen(!isNotificationsOpen)} className="p-2 rounded-full text-muted hover:text-on-surface hover:bg-gray-100">
                                            <BellIcon className="h-6 w-6" />
                                            {unreadCount > 0 && <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-surface"></span>}
                                        </button>
                                        {isNotificationsOpen && <NotificationsPanel onClose={() => setNotificationsOpen(false)} />}
                                    </div>
                                )}
                                <Disclosure.Button className="ml-2 inline-flex items-center justify-center rounded-md bg-surface p-2 text-muted hover:bg-gray-100 hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (<XMarkIcon className="block h-6 w-6" aria-hidden="true" />) : (<Bars3Icon className="block h-6 w-6" aria-hidden="true" />)}
                                </Disclosure.Button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Panel */}
                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 pt-2 pb-3 px-2">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="div"
                                    className="w-full text-left"
                                >
                                    {item.onClick ? (
                                        <a href={item.href} onClick={(e) => { item.onClick(e, item.href); close(); }}
                                            className="block rounded-md py-2 px-3 text-base font-medium text-muted hover:bg-gray-100 hover:text-on-surface">
                                            {item.name}
                                        </a>
                                    ) : (
                                        <NavLink to={item.href} onClick={close}
                                            className={({ isActive }) =>
                                                classNames(isActive ? 'bg-primary-light/50 text-primary-dark' : 'text-muted hover:bg-gray-100',
                                                    'block rounded-md py-2 px-3 text-base font-medium')}>
                                            {item.name}
                                        </NavLink>
                                    )}
                                </Disclosure.Button>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 pb-3">
                            {user ? (
                                <div className="px-2 space-y-1">
                                    <div className="flex items-center justify-between px-3 mb-2">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full object-cover"
                                                src={user.profilePicture?.startsWith('http') ? user.profilePicture :
                                                    user.profilePicture !== 'no-photo.jpg' ? `${API_URL}${user.profilePicture}` :
                                                        `https://ui-avatars.com/api/?name=${user.fullName}&background=8344AD&color=fff`}
                                                alt={user.fullName} />
                                            <div className="ml-3">
                                                <div className="text-base font-medium text-on-surface">{user.fullName}</div>
                                                <div className="text-sm font-medium text-muted">{user.email}</div>
                                            </div>
                                        </div>
                                        {/* <div className="relative">
                                            <button onClick={() => setNotificationsOpen(!isNotificationsOpen)} className="p-2 rounded-full text-muted hover:text-on-surface hover:bg-gray-100">
                                                <BellIcon className="h-6 w-6" />
                                                {unreadCount > 0 && <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-surface"></span>}
                                            </button>
                                            {isNotificationsOpen && <NotificationsPanel onClose={() => { setNotificationsOpen(false); close(); }} />}
                                        </div> */}
                                    </div>
                                    <Link to="/profile" onClick={close}
                                        className="block w-full text-left rounded-md py-2 px-3 text-base font-medium text-muted hover:bg-gray-100 hover:text-on-surface">
                                        Your Profile
                                    </Link>
                                    <button onClick={handleLogout}
                                        className="block w-full text-left rounded-md py-2 px-3 text-base font-medium text-muted hover:bg-gray-100 hover:text-on-surface">
                                        Sign out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2 px-2">
                                    <Link to="/login" onClick={close} className="block w-full text-center rounded-md py-2 px-3 text-base font-medium text-muted hover:bg-gray-100">Sign In</Link>
                                    <Link to="/register" onClick={close} className="block w-full text-center rounded-lg bg-primary py-2 px-3 text-base font-semibold text-white shadow-md hover:bg-primary-dark">Register</Link>
                                </div>
                            )}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
