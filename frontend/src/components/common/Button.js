import React from 'react';

export default function Button({ children, onClick, type = 'button', disabled = false, className = '' }) {
    const baseClasses = "group relative w-full flex justify-center py-2 sm:py-2.5 px-3 sm:px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-background bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
    const disabledClasses = "disabled:bg-primary-light disabled:cursor-not-allowed";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${disabledClasses} ${className}`}
        >
            {children}
        </button>
    );
}