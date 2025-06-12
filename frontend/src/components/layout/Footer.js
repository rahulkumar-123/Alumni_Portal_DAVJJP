import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-white">
            <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-base text-gray-400">&copy; {new Date().getFullYear()} MN Jha DAV Alumni Association. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
