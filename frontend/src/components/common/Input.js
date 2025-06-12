import React from 'react';

export default function Input({ id, name, type = 'text', placeholder, value, onChange, required = false, className = '' }) {
    const baseClasses = "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm";

    return (
        <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className={`${baseClasses} ${className}`}
        />
    );
}